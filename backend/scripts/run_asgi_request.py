import sys, os, asyncio, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core import security
from app.db.session import SessionLocal
from app.models.user import User

async def run_test():
    # Generate a real token
    db = SessionLocal()
    user = db.query(User).filter(User.email == 'manager@idbi.com').first()
    db.close()
    
    if not user:
        print("Error: User manager@idbi.com not found to generate token.")
        return
        
    token = security.create_access_token(data={"sub": user.email})
    print("Generated token:", token)

    scope = {
        'type': 'http',
        'method': 'GET',
        'path': '/api/v1/customers/3a7fed34-479c-4bd4-89d8-9e0fa63449b5',
        'headers': [
            (b'host', b'localhost:8000'),
            (b'accept', b'application/json'),
            (b'authorization', f'Bearer {token}'.encode('utf-8')),
        ],
        'query_string': b'',
    }
    
    async def receive():
        return {'type': 'http.request', 'body': b'', 'more_body': False}

    async def send(event):
        if event['type'] == 'http.response.start':
            print("Status:", event['status'])
            print("Headers:", event['headers'])
        elif event['type'] == 'http.response.body':
            print("Body:", event['body'].decode('utf-8'))

    print("Sending ASGI request with real auth...")
    try:
        await app(scope, receive, send)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_test())
