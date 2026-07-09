import sys, os, uuid
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.api.v1.endpoints.customers import read_customer, read_customer_loans
from app.api.v1.endpoints.ai import read_customer_predictions

db = SessionLocal()
u = uuid.UUID('3a7fed34-479c-4bd4-89d8-9e0fa63449b5')

print("\n--- Testing read_customer ---")
try:
    res = read_customer(customer_id=u, db=db, current_user=None)
    print("read_customer success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n--- Testing read_customer_loans ---")
try:
    res = read_customer_loans(customer_id=u, db=db, current_user=None)
    print("read_customer_loans success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()

print("\n--- Testing read_customer_predictions ---")
try:
    res = read_customer_predictions(customer_id=u, db=db, current_user=None)
    print("read_customer_predictions success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()

db.close()
