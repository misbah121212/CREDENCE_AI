import logging
import sys
import os

# Add parent directory to sys.path so we can import app modules when running directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import SessionLocal
from app.models.customer import Customer
from app.services.ai import run_customer_prediction

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def recalculate_all_risk_scores():
    """
    Automated batch task to loop through all customers, recalculate risk scores,
    and update prediction records, recommendations, and system alerts.
    """
    db = SessionLocal()
    try:
        customers = db.query(Customer).all()
        logger.info(f"Starting batch risk score recalculation for {len(customers)} customers...")
        
        count = 0
        success_count = 0
        for customer in customers:
            count += 1
            try:
                # Runs feature extraction, model prediction, SHAP explanation, persists to DB
                run_customer_prediction(db, customer_id=str(customer.id))
                success_count += 1
                if count % 10 == 0 or count == len(customers):
                    logger.info(f"Processed {count}/{len(customers)} customers successfully.")
            except Exception as e:
                logger.error(f"Failed to calculate risk score for customer {customer.id} ({customer.first_name} {customer.last_name}): {e}")
                
        logger.info(f"Batch recalculation completed. Successfully recalculated risk scores for {success_count}/{len(customers)} customers.")
        return success_count
    finally:
        db.close()

if __name__ == "__main__":
    recalculate_all_risk_scores()
