import urllib.request
import json

def test_endpoints():
    login_url = "http://localhost:8005/api/v1/auth/login"
    data = json.dumps({"email": "manager@idbi.com", "password": "password"}).encode('utf-8')
    req = urllib.request.Request(login_url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as res:
            token = json.loads(res.read().decode('utf-8'))['access_token']
            headers = {'Authorization': f'Bearer {token}'}
            
            # Test 1: Customer GET
            try:
                c_url = 'http://localhost:8005/api/v1/customers/3a7fed34-479c-4bd4-89d8-9e0fa63449b5'
                with urllib.request.urlopen(urllib.request.Request(c_url, headers=headers)) as r:
                    print("Customer GET: SUCCESS")
            except Exception as e:
                print("Customer GET: FAILED:", e)
                if hasattr(e, 'read'): print("  Body:", e.read().decode('utf-8'))
                
            # Test 2: Customer Loans GET
            try:
                l_url = 'http://localhost:8005/api/v1/customers/3a7fed34-479c-4bd4-89d8-9e0fa63449b5/loans'
                with urllib.request.urlopen(urllib.request.Request(l_url, headers=headers)) as r:
                    print("Loans GET: SUCCESS")
            except Exception as e:
                print("Loans GET: FAILED:", e)
                if hasattr(e, 'read'): print("  Body:", e.read().decode('utf-8'))
                
            # Test 3: Predictions GET
            try:
                p_url = 'http://localhost:8005/api/v1/ai/predictions/customer/3a7fed34-479c-4bd4-89d8-9e0fa63449b5'
                with urllib.request.urlopen(urllib.request.Request(p_url, headers=headers)) as r:
                    print("Predictions GET: SUCCESS")
            except Exception as e:
                print("Predictions GET: FAILED:", e)
                if hasattr(e, 'read'): print("  Body:", e.read().decode('utf-8'))
                
    except Exception as e:
        print("Auth failed:", e)

if __name__ == "__main__":
    test_endpoints()
