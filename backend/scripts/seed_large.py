"""
Credence AI - Large Scale Customer Seed Script
Adds ~10,000 realistic customers with loans to the database.
Safe: Does NOT delete existing data, only inserts if not already present.
Run: python backend/scripts/seed_large.py
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import uuid
import random
from datetime import datetime, date, timedelta
from decimal import Decimal

from app.db.session import SessionLocal
from app.models.customer import Customer
from app.models.loan import Loan, EMIHistory
from app.core.security import hash_password

# â”€â”€ Realistic Data Pools â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

FIRST_NAMES = [
    "Aarav", "Aditya", "Ajay", "Akash", "Amit", "Ananya", "Anil", "Anjali", "Ankit", "Anita",
    "Arjun", "Aryan", "Ashok", "Ayaan", "Bhavna", "Deepak", "Deepika", "Dev", "Dhruv", "Divya",
    "Fatima", "Gaurav", "Geeta", "Harish", "Harsha", "Isha", "Ishaan", "Jaya", "Karan", "Kavita",
    "Kirti", "Komal", "Krishna", "Kumar", "Lakshmi", "Lalit", "Madhuri", "Manish", "Meena", "Mehul",
    "Mohan", "Mohit", "Mukesh", "Nandita", "Naresh", "Neha", "Nikhil", "Nikita", "Nisha", "Om",
    "Pooja", "Poonam", "Pradeep", "Prakash", "Prashant", "Preethi", "Priya", "Punit", "Rahul", "Rajesh",
    "Rakesh", "Ramesh", "Ravi", "Rekha", "Ritesh", "Rohit", "Sachin", "Sadhana", "Sanjay", "Sanjana",
    "Seema", "Shilpa", "Shivam", "Shruti", "Shweta", "Simran", "Sneha", "Sunil", "Sunita", "Suresh",
    "Swati", "Tanvi", "Tarun", "Uday", "Uma", "Vandana", "Varun", "Vijay", "Vimal", "Vinay",
    "Vishal", "Yash", "Yogesh", "Zara", "Arif", "Bilal", "Farhan", "Imran", "Javed", "Salma",
    "Abdul", "Hassan", "Ibrahim", "Khalid", "Muhamad", "Nasreen", "Omar", "Razia", "Shabnam", "Tariq",
    "Gurpreet", "Harjeet", "Jaspreet", "Kuldeep", "Manjeet", "Navjot", "Paramjit", "Ranjit", "Sarbjit", "Tejinder",
]

LAST_NAMES = [
    "Agarwal", "Ahuja", "Batra", "Bhatt", "Chopra", "Das", "Desai", "Deshpande", "Dey", "Dubey",
    "Gandhi", "Garg", "Ghosh", "Goyal", "Gupta", "Iyer", "Jain", "Jha", "Kapoor", "Kaur",
    "Khan", "Khanna", "Kulkarni", "Kumar", "Lal", "Malhotra", "Mehta", "Mishra", "Modi", "Mohan",
    "Mukherjee", "Nair", "Naik", "Nair", "Pandey", "Patel", "Pillai", "Prasad", "Rao", "Reddy",
    "Roy", "Shah", "Sharma", "Shukla", "Singh", "Sinha", "Srivastava", "Tiwari", "Trivedi", "Varma",
    "Verma", "Yadav", "Mehra", "Bose", "Chatterjee", "Banerjee", "Sen", "Dutta", "Bhadra", "Mitra",
    "Chowdhury", "Biswas", "Das", "Mondal", "Sikandar", "Ansari", "Sheikh", "Siddiqui", "Qureshi", "Mirza",
]

OCCUPATIONS = [
    ("Software Engineer", "TCS"), ("Software Engineer", "Infosys"), ("Software Engineer", "Wipro"),
    ("Data Analyst", "Accenture"), ("Product Manager", "Flipkart"), ("UI/UX Designer", "Zomato"),
    ("Teacher", "Kendriya Vidyalaya"), ("Teacher", "DPS School"), ("Principal", "Modern School"),
    ("Doctor", "Apollo Hospital"), ("Doctor", "Fortis Healthcare"), ("Nurse", "AIIMS"),
    ("Bank Employee", "SBI"), ("Bank Employee", "HDFC Bank"), ("Bank Employee", "ICICI Bank"),
    ("Govt. Employee", "BSNL"), ("Govt. Employee", "State Transport"), ("IAS Officer", "State Government"),
    ("Business Owner", "Shah Textiles"), ("Business Owner", "Patel Traders"), ("Business Owner", "Self-Employed"),
    ("Accountant", "Deloitte"), ("CA", "PWC"), ("Lawyer", "District Court"),
    ("Marketing Manager", "HUL"), ("Sales Executive", "Reliance"), ("HR Manager", "Infosys"),
    ("Civil Engineer", "L&T"), ("Mechanical Engineer", "Tata Motors"), ("Electrician", "Self-Employed"),
    ("Farmer", "Self-Employed"), ("Retired", "N/A"), ("Homemaker", "N/A"),
    ("Auto Driver", "Self-Employed"), ("Shop Owner", "Self-Employed"), ("Contractor", "Self-Employed"),
    ("Factory Worker", "Mahindra"), ("Pharmacist", "MedPlus"), ("Architect", "Self-Employed"),
    ("Professor", "IIT Delhi"), ("Research Scientist", "DRDO"), ("Pilot", "Air India"),
]

LOAN_TYPES = ["Home", "Personal", "Business", "Car", "Education", "Gold", "Two-Wheeler"]

def random_dob(min_age=22, max_age=65) -> date:
    today = date.today()
    age = random.randint(min_age, max_age)
    return today.replace(year=today.year - age) - timedelta(days=random.randint(0, 364))

def random_credit_score() -> int:
    # Realistic distribution: more in 650-800 range
    weights = [5, 10, 20, 30, 20, 10, 5]
    ranges = [(300, 450), (451, 550), (551, 620), (621, 700), (701, 750), (751, 800), (801, 900)]
    chosen_range = random.choices(ranges, weights=weights, k=1)[0]
    return random.randint(*chosen_range)

def random_salary(occupation: str) -> Decimal:
    high_pay = ["Doctor", "Professor", "IAS Officer", "Pilot", "CA", "Research Scientist", "Software Engineer", "Product Manager"]
    mid_pay = ["Nurse", "Teacher", "Bank Employee", "Accountant", "Lawyer", "Architect", "Marketing Manager"]
    low_pay = ["Auto Driver", "Shop Owner", "Factory Worker", "Electrician", "Farmer", "Homemaker"]
    
    for h in high_pay:
        if h.lower() in occupation.lower():
            return Decimal(str(random.randint(120000, 500000)))
    for m in mid_pay:
        if m.lower() in occupation.lower():
            return Decimal(str(random.randint(45000, 150000)))
    for l in low_pay:
        if l.lower() in occupation.lower():
            return Decimal(str(random.randint(15000, 50000)))
    return Decimal(str(random.randint(30000, 200000)))

def seed_large(target_count: int = 10000):
    db = SessionLocal()
    try:
        # Check existing count
        existing_count = db.query(Customer).count()
        print(f"Existing customers in DB: {existing_count}")
        
        if existing_count >= target_count:
            print(f"Already have {existing_count} customers. Skipping.")
            return

        to_add = target_count - existing_count
        print(f"Adding {to_add} customers...")
        
        batch_size = 500
        added = 0
        batch_num = 0

        while added < to_add:
            batch_customers = []
            current_batch_size = min(batch_size, to_add - added)
            
            for i in range(current_batch_size):
                global_idx = existing_count + added + i + 1
                customer_id = f"CUST-{global_idx:06d}"
                
                # Check if this ID already exists
                existing = db.query(Customer).filter(Customer.customer_id_string == customer_id).first()
                if existing:
                    continue

                first = random.choice(FIRST_NAMES)
                last = random.choice(LAST_NAMES)
                occ_pair = random.choice(OCCUPATIONS)
                occupation, employer = occ_pair
                dob = random_dob()
                credit = random_credit_score()
                salary = random_salary(occupation)
                
                customer = Customer(
                    id=uuid.uuid4(),
                    customer_id_string=customer_id,
                    first_name=first,
                    last_name=last,
                    dob=dob,
                    occupation=occupation,
                    employer=employer,
                    monthly_salary=salary,
                    other_income=Decimal(str(random.randint(0, 15000))),
                    credit_score=credit,
                    family_dependents=random.randint(0, 4),
                )
                batch_customers.append(customer)

            if batch_customers:
                db.bulk_save_objects(batch_customers)
                db.commit()
                added += len(batch_customers)
                batch_num += 1
                print(f"  Batch {batch_num}: Added {len(batch_customers)} customers. Total added: {added}/{to_add}")

            # Add some loans for each batch
            recent_customers = batch_customers  # use in-memory list, already have ids
            loan_count = 0
            for cust in recent_customers:
                # 70% of customers have at least 1 loan
                if random.random() < 0.70:
                    num_loans = random.choices([1, 2, 3], weights=[70, 25, 5])[0]
                    for _ in range(num_loans):
                        loan_type = random.choice(LOAN_TYPES)
                        amount = random.randint(50000, 5000000)
                        rate = round(random.uniform(7.5, 16.5), 2)
                        tenure = random.choice([12, 24, 36, 48, 60, 84, 120, 180, 240])
                        emi = round((amount * (rate / 1200) * (1 + rate / 1200) ** tenure) / ((1 + rate / 1200) ** tenure - 1))
                        balance = random.randint(0, amount)
                        status_choices = ["Active", "Active", "Active", "Closed", "Defaulted"]
                        status = random.choice(status_choices)
                        missed_emis = 0
                        if status == "Defaulted":
                            missed_emis = random.randint(3, 9)
                        elif status == "Active":
                            missed_emis = random.choices([0, 1, 2], weights=[80, 15, 5])[0]
                        
                        start = date.today() - timedelta(days=random.randint(90, 1500))
                        loan = Loan(
                            id=uuid.uuid4(),
                            customer_id=cust.id,
                            loan_type=loan_type,
                            principal_amount=Decimal(str(amount)),
                            interest_rate=Decimal(str(rate)),
                            emi_amount=Decimal(str(emi)),
                            tenure_months=tenure,
                            remaining_balance=Decimal(str(balance)),
                            status=status,
                            start_date=start,
                            end_date=start + timedelta(days=tenure * 30),
                        )
                        db.add(loan)
                        loan_count += 1
            
            db.commit()
            print(f"  Added {loan_count} loans for this batch.")

        final_count = db.query(Customer).count()
        print(f"\nDone! Total customers in database: {final_count}")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    target = int(sys.argv[1]) if len(sys.argv) > 1 else 10000
    print(f"Target: {target} customers")
    seed_large(target)

