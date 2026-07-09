import os
import pickle
import pandas as pd
import numpy as np
import xgboost as xgb
import shap

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "xgb_model.json")
BG_DATA_PATH = os.path.join(MODEL_DIR, "background_data.pkl")

class CreditRiskPredictor:
    def __init__(self):
        self.model = None
        self.explainer = None
        self.background_data = None
        self.load_model()
        
    def load_model(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(BG_DATA_PATH):
            # Load XGBoost Model
            self.model = xgb.XGBClassifier()
            self.model.load_model(MODEL_PATH)
            
            # Load SHAP baseline background data
            with open(BG_DATA_PATH, "rb") as f:
                self.background_data = pickle.load(f)
                
            # Initialize TreeExplainer
            self.explainer = shap.TreeExplainer(self.model, data=self.background_data)
            print("AI Engine: XGBoost model and SHAP explainer loaded successfully!")
        else:
            print("AI Engine WARNING: Model artifacts not found. Run trainer.py first.")
            
    def predict(self, feature_data: dict) -> dict:
        """
        Receives dict of raw features, constructs model input, predicts default probability
        and runs SHAP explainability.
        """
        if self.model is None or self.explainer is None:
            raise RuntimeError("Model or explainer not initialized.")
            
        # 1. Map dict to DataFrame in correct training feature order
        feature_order = [
            'credit_score', 'debt_to_income', 'missed_emi_6m', 
            'salary_change_pct', 'dependents', 'remaining_balance_ratio'
        ]
        
        df = pd.DataFrame([{f: feature_data.get(f, 0.0) for f in feature_order}])
        
        # 2. Get predictions
        prob = float(self.model.predict_proba(df)[0][1])
        risk_score = int(prob * 100)
        
        if risk_score >= 70:
            risk_category = "High"
        elif risk_score >= 40:
            risk_category = "Medium"
        else:
            risk_category = "Low"
            
        # 3. Run local SHAP explainability
        shap_values = self.explainer.shap_values(df)[0]
        
        # Format explanations (map back to original features)
        explanations = []
        for feat, val in zip(feature_order, shap_values):
            # Format feature names for friendly front-end display
            friendly_name = feat.replace('_', ' ').title()
            # Scaling factor for presentation (SHAP log-odds mapped roughly to probability contribution %)
            impact_percent = int(val * 100)
            
            explanations.append({
                "feature": friendly_name,
                "impact": impact_percent
            })
            
        # Sort features by absolute impact
        explanations = sorted(explanations, key=lambda x: abs(x["impact"]), reverse=True)
            
        return {
            "default_probability": prob,
            "risk_score": risk_score,
            "risk_category": risk_category,
            "shap_explanations": {"features": explanations}
        }

# Singleton instance
predictor = CreditRiskPredictor()
