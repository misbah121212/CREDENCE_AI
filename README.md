# Credence AI 🛡️
### *One Connected Financial Ecosystem Powered by Continuous Artificial Intelligence.*

Credence AI is a premium, enterprise-grade AI command center and credit risk intelligence platform. Designed with an advanced **Apple VisionOS-inspired 3D glassmorphic UI**, the platform empowers banking executives to monitor portfolio risk, inspect real-time AI default predictions, explore model explainability (XAI), and interact with an intelligent Copilot.

---

## 🌟 Key Features

### 💻 Enterprise Command Dashboard
* **Executive Intelligence Strip**: A real-time command dashboard featuring:
  * **3D Animated Globe**: A slow-rotating stand-held globe showing connections to global banking networks.
  * **Today's Operations**: Checklists with glowing active review tracking.
  * **AI Engine Status**: Live confidence metrics (96.8%) with an animated audio/waveform indicator showing model activity.
  * **Banking Monitor**: Tracking branches, total borrows, and loan volumes in real-time.
* **Copilot Chatbot Mascot**: A floating, bobbing purple 3D clay robot mascot. Clicking the mascot or its message box launches the AI Assistant panel.
* **Interactive 3D Cards**: Smooth mouse-tracking 3D tilt and specularity reflection highlights across all dashboard elements.
* **Default Rate Forecast & Stats**: Clear metrics and 24-month forecast trend charts showing predicted vs. actual default probabilities.

### 👥 Customer Risk Deep-Dives
* Case-insensitive, real-time database searching.
* Comprehensive customer profile inspect layouts with salary slips, occupation details, family dependents, and EMI history logs.
* Visual risk gauges and historical loan statuses.

### 🧠 Explainable AI (XAI) Integration
* **SHAP Explainers**: Interactive visual bar charts breaking down exactly *why* the AI flagged a borrower (e.g. debt-to-income ratio, missed payments, low credit score).
* **Recommendations**: Dynamic, model-driven suggestions (e.g. restructuring, manual review, approval with collateral).

---

## 🏗️ Architecture & Technology Stack

* **Frontend**: React 18, TypeScript, Vite, TailwindCSS (v4), Recharts, Lucide React, and Framer Motion.
* **Backend**: FastAPI (Python), SQLAlchemy, SQLite (with WAL journaling and AES-256 security paradigms).
* **AI Core**: Scikit-Learn, XGBoost Classifier, SHAP (SHapley Additive exPlanations).

---

## 🚀 Getting Started

The platform is fully containerized with Docker for seamless setup.

### 🐳 1. Running with Docker Compose
Make sure you are in the project root folder. Build the images and launch the containers:
```bash
docker compose up --build -d
```
* **Frontend Application**: [http://localhost:5173](http://localhost:5173)
* **Backend REST API**: [http://localhost:8000](http://localhost:8000)

---

## 🛠️ Local Development Setup (Manual)

If you prefer running the servers natively on your machine:

### 1. Backend Server Setup
Ensure Python 3.9+ is installed:
```bash
cd backend
python -m venv venv

# Activate Virtual Environment:
# Windows:
.\venv\Scripts\activate
# MacOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8005
```
*(Note: Backend must be run on port `8005` to match the local development configuration).*

### 2. Frontend Development Setup
```bash
cd frontend
npm install
npm run dev
```
* Access the app locally: [http://localhost:5173](http://localhost:5173)

---

## 🏦 Seeded Test Credentials

To log into the dashboard, use the seeded executive account:
* **Username/Email**: `manager@idbi.com`
* **Password**: `password`

---

## 🔄 Batch AI Recalculation Task
To recalculate risk predictions across the entire database asynchronously:
```bash
# In the backend environment
python -m app.tasks.recalculate
```
Or trigger it via a REST API client:
* **Endpoint**: `POST http://localhost:8005/api/v1/ai/recalculate`

---
*Crafted for Hackathons by **2D Developers**.*
