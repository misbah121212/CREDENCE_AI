import sys
from os.path import abspath, dirname

sys.path.insert(0, dirname(dirname(abspath(__file__))))

from app.db.session import SessionLocal
from app.models.customer import Customer
from app.models.ai import Prediction, Recommendation, Alert
from app.services.ai import run_customer_prediction

def test_prediction_integration():
    db = SessionLocal()
    try:
        # Get John Doe
        customer = db.query(Customer).filter(Customer.customer_id_string == "CUST-8492").first()
        assert customer is not None, "Seed data not found. Please run seed script first."
        
        # Run AI prediction pipeline
        print(f"Running prediction integration for {customer.first_name} {customer.last_name}...")
        pred = run_customer_prediction(db, str(customer.id))
        
        # Verify prediction was written
        assert pred.id is not None
        assert pred.risk_score >= 0 and pred.risk_score <= 100
        print("✓ Prediction generated successfully!")
        print("  Risk Score:", pred.risk_score)
        print("  Risk Category:", pred.risk_category)
        print("  SHAP Explanations:", pred.shap_explanations)
        
        # Verify recommendations were written
        recs = db.query(Recommendation).filter(Recommendation.prediction_id == pred.id).all()
        assert len(recs) > 0
        print(f"✓ Generated {len(recs)} AI Recommendations:")
        for r in recs:
            print(f"  - [{r.priority}] {r.action_text}")
            
        # Verify alert was written if risk category is High
        if pred.risk_category == "High":
            alerts = db.query(Alert).filter(Alert.customer_id == customer.id).all()
            assert len(alerts) > 0
            print(f"✓ Generated {len(alerts)} system alerts.")
            
        print("ALL TESTS PASSED!")
    finally:
        db.close()

if __name__ == "__main__":
    test_prediction_integration()
