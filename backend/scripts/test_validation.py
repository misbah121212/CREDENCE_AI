import sys, os, uuid
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.customer import Customer
from app.schemas.customer import CustomerOut

db = SessionLocal()
try:
    c = db.query(Customer).filter(Customer.id == uuid.UUID('3a7fed34-479c-4bd4-89d8-9e0fa63449b5')).first()
    print("Found Customer:", c)
    if c:
        out = CustomerOut.model_validate(c)
        print("Pydantic validate SUCCESS:", out)
except Exception as e:
    import traceback
    print("Validation failed:")
    traceback.print_exc()
finally:
    db.close()
