import os
from os.path import abspath
import pickle
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split

MODEL_DIR = os.path.dirname(abspath(__file__)) if '__file__' in locals() else '.'

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # ── 1. Draw independent features ──
    credit_score = np.random.randint(500, 850, size=num_samples)
    debt_to_income = np.random.uniform(0.1, 0.8, size=num_samples)
    missed_emi_6m = np.random.randint(0, 7, size=num_samples)
    salary_change_pct = np.random.uniform(-0.5, 0.3, size=num_samples)
    dependents = np.random.randint(0, 5, size=num_samples)
    remaining_balance_ratio = np.random.uniform(0.0, 1.0, size=num_samples)
    
    df = pd.DataFrame({
        'credit_score': credit_score,
        'debt_to_income': debt_to_income,
        'missed_emi_6m': missed_emi_6m,
        'salary_change_pct': salary_change_pct,
        'dependents': dependents,
        'remaining_balance_ratio': remaining_balance_ratio
    })
    
    # ── 2. Heuristic probability score (ground truth model logic) ──
    # Low credit score increases default chance
    # High debt-to-income increases default chance
    # Any missed EMIs heavily increase default chance
    # Negative salary change increases default chance
    risk_score = (
        (850 - credit_score) / 350.0 * 2.0 +
        debt_to_income * 2.5 +
        (missed_emi_6m / 6.0) * 5.0 -
        salary_change_pct * 3.0 +
        (dependents * 0.2) +
        remaining_balance_ratio * 0.5
    )
    
    # Sigmoid function to convert risk_score to probability
    prob = 1 / (1 + np.exp(-(risk_score - 4.5)))
    y = (prob > 0.5).astype(int)
    
    return df, y

def train_and_save_model():
    print("Generating synthetic banking risk dataset...")
    X, y = generate_synthetic_data(2000)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.08,
        random_state=42,
        eval_metric='logloss'
    )
    model.fit(X_train, y_train)
    
    # Score metrics
    train_acc = model.score(X_train, y_train)
    test_acc = model.score(X_test, y_test)
    print(f"Model trained! Train Accuracy: {train_acc:.2%}, Test Accuracy: {test_acc:.2%}")
    
    # Save the model
    model_path = os.path.join(MODEL_DIR, "xgb_model.json")
    model.save_model(model_path)
    
    # Save the training background set for SHAP TreeExplainer baseline
    bg_path = os.path.join(MODEL_DIR, "background_data.pkl")
    with open(bg_path, "wb") as f:
        # Save a subset of training data (e.g. 100 rows) as background distribution
        pickle.dump(X_train.sample(100, random_state=42), f)
        
    print(f"Saved model to {model_path} and background set to {bg_path}")

if __name__ == "__main__":
    from os.path import abspath
    train_and_save_model()
else:
    from os.path import abspath
