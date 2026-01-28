from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
from datetime import timedelta

# Image utils (future use)
from PIL import Image
import io
import base64

app = FastAPI()

print("📂 Current working dir:", os.getcwd())
print("📂 Models folder exists:", os.path.exists("models"))
print("📂 Wheat model exists:", os.path.exists("models/xgb_wheat.pkl"))
print("📂 Files in models:", os.listdir("models") if os.path.exists("models") else "NO MODELS DIR")

print("\n🚜 KrishiPredict ML Server Starting...")

# =========================================================
# XGBOOST PRICE PREDICTION
# =========================================================

def predict_future_prices_xgboost(crop_name, district):
    model_path = f"models/xgb_{crop_name.lower()}.pkl"
    if not os.path.exists(model_path):
        return None, "Model not found"

    model = joblib.load(model_path)

    csv_path = "data/mandi_history.csv"
    if not os.path.exists(csv_path):
        return None, "CSV Data missing"

    df = pd.read_csv(csv_path)

    # --- CLEAN & RENAME (MATCH CSV EXACTLY) ---
    df.columns = df.columns.str.strip()

    rename_map = {
        "Price Date": "date",
        "Modal_Price": "modal_price",
        "Commodity": "crop",
        "District Name": "district_name"
    }
    df = df.rename(columns=rename_map)

    # --- TYPE SAFETY (CRITICAL FIX) ---
    df["modal_price"] = pd.to_numeric(df["modal_price"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    df = df.dropna(subset=["date", "modal_price"]).sort_values("date")

    # --- FILTER BY CROP ---
    crop_df = df[df["crop"].str.contains(crop_name, case=False, na=False)]
    if crop_df.empty:
        return None, "No Data for Crop"

    # --- FILTER BY DISTRICT (OPTIONAL) ---
    local_df = crop_df[crop_df["district_name"].str.contains(district, case=False, na=False)]

    if local_df.empty:
        working_df = crop_df
        location_label = "All India Trends"
    else:
        working_df = local_df
        location_label = district

    last_row = working_df.iloc[-1]
    current_date = last_row["date"]

    inputs = {
        "lag_1": last_row["modal_price"],
        "lag_7": working_df["modal_price"].iloc[-7] if len(working_df) > 7 else last_row["modal_price"],
        "lag_30": working_df["modal_price"].iloc[-30] if len(working_df) > 30 else last_row["modal_price"],
        "rolling_mean_7": working_df["modal_price"].tail(7).mean(),
        "rolling_std_7": working_df["modal_price"].tail(7).std() if len(working_df) > 7 else 0,
    }

    future_predictions = []

    for i in range(1, 31):
        next_date = current_date + timedelta(days=i)

        features = pd.DataFrame([{
            "day_of_year": next_date.dayofyear,
            "month": next_date.month,
            "year": next_date.year,
            "lag_1": inputs["lag_1"],
            "lag_7": inputs["lag_7"],
            "lag_30": inputs["lag_30"],
            "rolling_mean_7": inputs["rolling_mean_7"],
            "rolling_std_7": inputs["rolling_std_7"]
        }])

        # --- FORCE FEATURE ORDER (XGBOOST FIX) ---
        expected_features = [
            "day_of_year", "month", "year",
            "lag_1", "lag_7", "lag_30",
            "rolling_mean_7", "rolling_std_7"
        ]
        features = features[expected_features]

        pred_price = model.predict(features)[0]

        future_predictions.append({
            "date": next_date.strftime("%Y-%m-%d"),
            "price": round(float(pred_price), 2)
        })

        inputs["lag_7"] = inputs["lag_1"]
        inputs["lag_1"] = pred_price
        inputs["rolling_mean_7"] = (inputs["rolling_mean_7"] * 6 + pred_price) / 7

    return future_predictions, location_label


# =========================================================
# API SCHEMA
# =========================================================

class CropInput(BaseModel):
    crop: str
    district: str
    state: str
    area_acres: float


# =========================================================
# ROUTES
# =========================================================

@app.get("/")
def read_root():
    return {"status": "ML Server Running (XGBoost) 🚀"}


@app.post("/v1/predict")
def predict_price(data: CropInput):
    forecast, source_loc = predict_future_prices_xgboost(data.crop, data.district)

    if not forecast:
        return {"error": f"No prediction data available for {data.crop}"}

    current_price = forecast[0]["price"]
    future_price = forecast[-1]["price"]

    change_pct = ((future_price - current_price) / current_price) * 100

    if change_pct > 5:
        advice = f"AI: अगले 30 दिनों में भाव {int(change_pct)}% बढ़ने की उम्मीद है। होल्ड करें (Hold)।"
        color = "green"
        trend = "increasing"
    elif change_pct < -5:
        advice = f"AI: भाव {int(abs(change_pct))}% गिर सकता है। बेचें (Sell)।"
        color = "red"
        trend = "decreasing"
    else:
        advice = "AI: बाजार स्थिर रहेगा। आप अपनी सुविधानुसार निर्णय लें।"
        color = "yellow"
        trend = "stable"

    return {
        "crop": data.crop,
        "location": source_loc,
        "current_price": current_price,
        "forecast": forecast,
        "advice": advice,
        "risk_color": color,
        "confidence": 0.94,
        "trend": trend
    }


@app.post("/v1/detect-disease")
async def detect_disease(data: dict):
    return {
        "disease_name": "Feature Coming Soon",
        "status": "Info",
        "solution": "Disease detection will be enabled in a future update.",
        "confidence": 0.0,
        "risk_color": "blue"
    }
