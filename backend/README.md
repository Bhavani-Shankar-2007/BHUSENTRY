# ⚙️ BHUSENTRY — Backend Service & Machine Learning Core

Production-grade FastAPI backend powering the **BHUSENTRY Landslide Early Warning & Risk Monitoring Platform**.

---

## 🏛️ Core Architecture

- **Web Framework**: FastAPI (Asynchronous endpoints, Pydantic v2 validation, standard dependency injection).
- **Database & Auth**: Supabase (PostgreSQL with PostGIS extensions & Supabase Auth JWT security).
- **Machine Learning & Physics Engine**:
  - **Random Forest Classifier**: Scikit-Learn ensemble trained with physics-grounded synthetic geological samples and saved to `app/ml/model.joblib`.
  - **Physics Formulation**: Calibrated geotechnical Mohr-Coulomb shear strength and GSI Landslide Hazard Evaluation Factor (LHEF) scoring.
  - **Hybrid Inference**: Weighted 65% ML + 35% Geotechnical physics for robust out-of-distribution stability.
- **External Data Connectors**:
  - **Weather**: Open-Meteo REST API (real-time precipitation, 72h accumulation, soil moisture).
  - **Satellite**: NASA GIBS (EOSDIS) WMS & ESRI World Imagery.
  - **AI Copilot**: Google Gemini API with fallback rule-based advisor.

---

## 🚀 Getting Started

### 1. Requirements
- Python 3.10 or higher
- PowerShell / Bash

### 2. Setup Virtual Environment & Install Dependencies

```bash
# In the backend directory
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Linux / MacOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
copy .env.example .env
```

Edit `.env` to configure your Supabase URL/Key, Gemini API key, and other services.

### 4. Run Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- Swagger Interactive API Docs: `http://localhost:8000/docs`
- ReDoc Docs: `http://localhost:8000/redoc`

---

## 🔬 Machine Learning Pipeline

- **Training**: Run `python -c "from app.ml.model import get_or_create_model; get_or_create_model()"` to retrain the Random Forest model.
- **Features**:
  1. `rainfall_24h_mm`: 24-hour accumulated rainfall (mm) — primary trigger
  2. `rainfall_72h_mm`: 72-hour antecedent rainfall (mm) — soil pre-saturation
  3. `slope_deg`: Topographical slope gradient (degrees)
  4. `elevation_m`: Station elevation above sea level (meters)
  5. `soil_moisture`: Soil moisture content (normalized 0.0 – 1.0)
  6. `ndvi`: Normalized Difference Vegetation Index (-1.0 to 1.0) — root cohesion
  7. `pore_water_pressure_kpa`: Pore water pressure (kPa) — shear resistance reduction
- **Risk Classification**:
  - `0.00 – 0.24`: LOW
  - `0.25 – 0.54`: MODERATE
  - `0.55 – 0.79`: HIGH
  - `0.80 – 1.00`: VERY HIGH

---

## 🧪 Testing Predictor

```bash
.\venv\Scripts\python.exe -c "from app.ml.predictor import predictor_engine; print(predictor_engine.predict({'rainfall_24h_mm': 180, 'slope_deg': 40, 'soil_moisture': 0.8}))"
```
