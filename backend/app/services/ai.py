from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.loan import Loan, EMIHistory
from app.ai_engine.predictor import predictor

def extract_customer_features(db: Session, customer_id: str) -> dict:
    """
    Extracts and compiles the 6 features required by the XGBoost risk model
    from database tables (Customer, Loan, EMIHistory).
    """
    import uuid
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    customer = db.query(Customer).filter(Customer.id == cust_uuid).first()
    if not customer:
        raise ValueError("Customer not found")
        
    # 1. Credit Score
    credit_score = customer.credit_score or 650
    
    # 2. Debt to Income (DTI) Ratio
    monthly_income = float((customer.monthly_salary or Decimal(0)) + (customer.other_income or Decimal(0)))
    if monthly_income <= 0:
        monthly_income = 1.0  # Avoid division by zero
        
    active_loans = db.query(Loan).filter(Loan.customer_id == cust_uuid, Loan.status == "Active").all()
    total_monthly_emi = sum(float(l.emi_amount) for l in active_loans)
    debt_to_income = min(total_monthly_emi / monthly_income, 1.0)
    
    # 3. Missed EMIs in last 6 months
    six_months_ago = datetime.now() - timedelta(days=180)
    loan_ids = [l.id for l in active_loans]
    
    missed_emi_count = 0
    if loan_ids:
        missed_emi_count = db.query(EMIHistory).filter(
            EMIHistory.loan_id.in_(loan_ids),
            EMIHistory.payment_date >= six_months_ago.date(),
            EMIHistory.status == "Missed"
        ).count()
        
    # Limit missed EMIs to a max of 6 (model training bounds)
    missed_emi_6m = min(missed_emi_count, 6)
    
    # 4. Salary change percentage (defaulting to 0 for static profiles, 
    # but could be updated if payroll ledger entries are tracked)
    salary_change_pct = 0.0
    
    # 5. Dependents
    dependents = customer.family_dependents or 0
    
    # 6. Remaining Balance Ratio (Total Remaining / Total Principal)
    total_principal = sum(float(l.principal_amount) for l in active_loans)
    total_remaining = sum(float(l.remaining_balance) for l in active_loans)
    
    remaining_balance_ratio = 1.0
    if total_principal > 0:
        remaining_balance_ratio = min(total_remaining / total_principal, 1.0)
        
    return {
        "credit_score": float(credit_score),
        "debt_to_income": float(debt_to_income),
        "missed_emi_6m": float(missed_emi_6m),
        "salary_change_pct": float(salary_change_pct),
        "dependents": float(dependents),
        "remaining_balance_ratio": float(remaining_balance_ratio)
    }

def run_customer_prediction(db: Session, customer_id: str):
    """
    Extracts features, runs the model, and persists predictions, recommendations, 
    and system alerts to the database.
    """
    import uuid
    cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
    from app.crud import ai as crud_ai
    
    # Extract
    features = extract_customer_features(db, cust_uuid)
    
    # Predict
    prediction_results = predictor.predict(features)
    
    # Persist Prediction
    db_pred = crud_ai.create_prediction(
        db,
        customer_id=cust_uuid,
        default_probability=Decimal(prediction_results["default_probability"]),
        risk_score=prediction_results["risk_score"],
        risk_category=prediction_results["risk_category"],
        shap_explanations=prediction_results["shap_explanations"]
    )
    
    # Generate Recommendations based on risk drivers
    # Primary driver is usually the feature with highest positive SHAP impact
    shap_features = prediction_results["shap_explanations"]["features"]
    top_driver = shap_features[0]["feature"] if shap_features else "General Risk Profile"
    
    if prediction_results["risk_category"] == "High":
        crud_ai.create_recommendation(
            db, 
            prediction_id=str(db_pred.id), 
            action_text=f"Initiate restructuring discussion due to {top_driver} risk", 
            priority="High"
        )
        crud_ai.create_recommendation(
            db, 
            prediction_id=str(db_pred.id), 
            action_text="Request updated income proof / salary slips", 
            priority="High"
        )
        # Create system alert
        customer = db.query(Customer).filter(Customer.id == cust_uuid).first()
        crud_ai.create_alert(
            db, 
            customer_id=cust_uuid, 
            alert_message=f"Risk score jumped to {prediction_results['risk_score']} ({top_driver} impact) for {customer.first_name} {customer.last_name}"
        )
    elif prediction_results["risk_category"] == "Medium":
        crud_ai.create_recommendation(
            db, 
            prediction_id=str(db_pred.id), 
            action_text="Set up auto-debit mandate to prevent missed EMIs", 
            priority="Medium"
        )
    else:
        crud_ai.create_recommendation(
            db, 
            prediction_id=str(db_pred.id), 
            action_text="No action needed. standard account health.", 
            priority="Low"
        )
        
    return db_pred
