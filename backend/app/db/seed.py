from datetime import datetime, date
from decimal import Decimal
import uuid

from app.db.session import SessionLocal
from app.models.user import Role, User
from app.models.customer import Customer, Document
from app.models.loan import Loan, EMIHistory
from app.models.ai import Prediction, Recommendation, Alert
from app.core.security import hash_password

def seed_data():
    db = SessionLocal()
    try:
        # ── 1. Seed Roles ──
        admin_role = db.query(Role).filter(Role.name == "Admin").first()
        if not admin_role:
            admin_role = Role(id=uuid.uuid4(), name="Admin", description="System Administrator")
            db.add(admin_role)
            
        manager_role = db.query(Role).filter(Role.name == "Bank Manager").first()
        if not manager_role:
            manager_role = Role(id=uuid.uuid4(), name="Bank Manager", description="Bank Branch Manager")
            db.add(manager_role)
            
        analyst_role = db.query(Role).filter(Role.name == "Credit Analyst").first()
        if not analyst_role:
            analyst_role = Role(id=uuid.uuid4(), name="Credit Analyst", description="Credit Risk Analyst")
            db.add(analyst_role)
            
        db.commit()

        # ── 2. Seed Default Bank Manager ──
        manager_user = db.query(User).filter(User.email == "manager@idbi.com").first()
        if not manager_user:
            manager_user = User(
                id=uuid.uuid4(),
                email="manager@idbi.com",
                password_hash=hash_password("password"),
                first_name="Bank",
                last_name="Manager",
                role_id=manager_role.id,
                is_active=True
            )
            db.add(manager_user)
            db.commit()

        # ── 3. Seed Mock Customers ──
        customers_data = [
            {"id_str": "CUST-8492", "first": "John", "last": "Doe", "occupation": "Software Engineer", "employer": "TechSoft Ltd.", "salary": 120000, "credit": 620, "age": 34},
            {"id_str": "CUST-3310", "first": "Sunita", "last": "Rao", "occupation": "Teacher", "employer": "St. Mary School", "salary": 45000, "credit": 720, "age": 42},
            {"id_str": "CUST-7721", "first": "Amit", "last": "Kumar", "occupation": "Govt. Employee", "employer": "State Transport", "salary": 80000, "credit": 810, "age": 29},
            {"id_str": "CUST-6602", "first": "Fatima", "last": "Sheikh", "occupation": "Business Owner", "employer": "Sheikh Exports", "salary": 250000, "credit": 640, "age": 45},
            {"id_str": "CUST-1042", "first": "Priya", "last": "Sharma", "occupation": "Marketing Manager", "employer": "BrandMedia Inc.", "salary": 95000, "credit": 660, "age": 31},
            {"id_str": "CUST-2891", "first": "Rahul", "last": "Mehta", "occupation": "Freelancer", "employer": "Self-Employed", "salary": 60000, "credit": 590, "age": 27},
            {"id_str": "CUST-0334", "first": "Anita", "last": "Desai", "occupation": "Doctor", "employer": "City Hospital", "salary": 180000, "credit": 695, "age": 52},
            {"id_str": "CUST-5512", "first": "Vijay", "last": "Patel", "occupation": "Factory Owner", "employer": "Patel Plastics", "salary": 300000, "credit": 680, "age": 48},
        ]

        inserted_customers = {}
        for c in customers_data:
            cust = db.query(Customer).filter(Customer.customer_id_string == c["id_str"]).first()
            if not cust:
                cust = Customer(
                    id=uuid.uuid4(),
                    customer_id_string=c["id_str"],
                    first_name=c["first"],
                    last_name=c["last"],
                    dob=date(datetime.now().year - c["age"], 1, 1),
                    occupation=c["occupation"],
                    employer=c["employer"],
                    monthly_salary=Decimal(c["salary"]),
                    other_income=Decimal(15000 if c["first"] == "John" else 0),
                    credit_score=c["credit"],
                    family_dependents=2 if c["first"] in ["John", "Anita"] else 0
                )
                db.add(cust)
                db.commit()
            inserted_customers[c["id_str"]] = cust

        # ── 4. Seed Mock Loans ──
        loans_data = [
            {"id": "LN-0012", "cust_id": "CUST-8492", "type": "Home", "amount": 4800000, "emi": 24500, "rate": 8.75, "tenure": 240, "balance": 2640000, "status": "Active", "missed": 2},
            {"id": "LN-0034", "cust_id": "CUST-2891", "type": "Personal", "amount": 500000, "emi": 11200, "rate": 13.5, "tenure": 60, "balance": 320000, "status": "Active", "missed": 3},
            {"id": "LN-0051", "cust_id": "CUST-6602", "type": "Business", "amount": 2500000, "emi": 52000, "rate": 11.25, "tenure": 84, "balance": 1840000, "status": "Active", "missed": 0},
            {"id": "LN-0078", "cust_id": "CUST-3310", "type": "Education", "amount": 800000, "emi": 9800, "rate": 7.5, "tenure": 120, "balance": 560000, "status": "Active", "missed": 1},
            {"id": "LN-0093", "cust_id": "CUST-5512", "type": "Car", "amount": 1200000, "emi": 26000, "rate": 9.25, "tenure": 60, "balance": 410000, "status": "Active", "missed": 0},
            {"id": "LN-0102", "cust_id": "CUST-1042", "type": "Home", "amount": 3500000, "emi": 31200, "rate": 8.9, "tenure": 180, "balance": 2890000, "status": "Defaulted", "missed": 6},
            {"id": "LN-0115", "cust_id": "CUST-7721", "type": "Home", "amount": 2200000, "emi": 18500, "rate": 8.5, "tenure": 240, "balance": 1980000, "status": "Active", "missed": 0},
            {"id": "LN-0131", "cust_id": "CUST-0334", "type": "Car", "amount": 900000, "emi": 19400, "rate": 9.0, "tenure": 60, "balance": 230000, "status": "Closed", "missed": 0},
        ]

        for l in loans_data:
            # We check using custom query since we want unique seed loans
            cust = inserted_customers[l["cust_id"]]
            loan = db.query(Loan).filter(Loan.customer_id == cust.id, Loan.loan_type == l["type"]).first()
            if not loan:
                loan = Loan(
                    id=uuid.uuid4(),
                    customer_id=cust.id,
                    loan_type=l["type"],
                    principal_amount=Decimal(l["amount"]),
                    interest_rate=Decimal(l["rate"]),
                    emi_amount=Decimal(l["emi"]),
                    tenure_months=l["tenure"],
                    remaining_balance=Decimal(l["balance"]),
                    status=l["status"],
                    start_date=date(2021, 3, 1),
                    end_date=date(2021 + (l["tenure"] // 12), 3, 1)
                )
                db.add(loan)
                db.commit()

                # Seed EMI History
                for m_offset in range(6):
                    status = "Paid"
                    amount_paid = Decimal(l["emi"])
                    if l["missed"] > 0 and m_offset >= (6 - l["missed"]):
                        status = "Missed"
                        amount_paid = Decimal(0)
                    elif l["missed"] > 0 and m_offset == (5 - l["missed"]):
                        status = "Late"
                    
                    emi = EMIHistory(
                        id=uuid.uuid4(),
                        loan_id=loan.id,
                        payment_date=date(2025, 1 + m_offset, 1),
                        amount_paid=amount_paid,
                        status=status,
                        remarks="Standard monthly payment" if status == "Paid" else "Payment not received"
                    )
                    db.add(emi)
                db.commit()

        # ── 5. Seed Mock Predictions, Recommendations, and Alerts ──
        # John Doe (CUST-8492) Risk Prediction
        john = inserted_customers["CUST-8492"]
        john_pred = db.query(Prediction).filter(Prediction.customer_id == john.id).first()
        if not john_pred:
            john_pred = Prediction(
                id=uuid.uuid4(),
                customer_id=john.id,
                default_probability=Decimal(0.85),
                risk_score=85,
                risk_category="High",
                shap_explanations={
                    "features": [
                        {"feature": "Missed EMI (Jan & Feb)", "impact": 22},
                        {"feature": "Salary Decreased (-30%)", "impact": 15},
                        {"feature": "High Credit Utilization", "impact": 10},
                        {"feature": "Large Withdrawals", "impact": 8},
                        {"feature": "Employment Instability", "impact": 6},
                        {"feature": "Loan Tenure (Positive)", "impact": -12},
                        {"feature": "Employment History (Positive)", "impact": -5}
                    ]
                }
            )
            db.add(john_pred)
            db.commit()

            # Seed Recommendations
            db.add(Recommendation(id=uuid.uuid4(), prediction_id=john_pred.id, action_text="Initiate immediate loan restructuring discussion", priority="High", status="Pending"))
            db.add(Recommendation(id=uuid.uuid4(), prediction_id=john_pred.id, action_text="Request updated income proof / salary slips", priority="High", status="Pending"))
            db.add(Recommendation(id=uuid.uuid4(), prediction_id=john_pred.id, action_text="Set up auto-debit ECS mandate", priority="Medium", status="Pending"))
            
            # Seed Alert
            db.add(Alert(id=uuid.uuid4(), customer_id=john.id, alert_message="Risk score jumped to 85 (+55 in 6 months)", is_read=False))
            db.commit()

        print("Database seeded successfully with Roles, Users, Customers, Loans, and AI Predictions!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
