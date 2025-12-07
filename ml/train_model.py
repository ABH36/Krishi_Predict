import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

print("\n🚀 Running NEW Script... (Checking CSV Columns)")

# Folder check
if not os.path.exists("models"):
    os.makedirs("models")

try:
    # 1. Load CSV
    csv_path = "data/mandi_history.csv"
    if not os.path.exists(csv_path):
        print(f"❌ Error: '{csv_path}' file nahi mili!")
        exit()
        
    df = pd.read_csv(csv_path)
    
    # 2. Columns Clean karo (Extra spaces hatao)
    df.columns = df.columns.str.strip()
    print(f"📊 Columns found inside CSV: {list(df.columns)}")

    # 3. Rename Logic (Kaggle Data Handle karne ke liye)
    # Hum check karenge ki column ka asli naam kya hai
    rename_map = {}
    
    if 'Price Date' in df.columns:
        rename_map['Price Date'] = 'date'
    elif 'arrival_date' in df.columns:
        rename_map['arrival_date'] = 'date'
        
    if 'Modal Price' in df.columns:
        rename_map['Modal Price'] = 'modal_price'
    elif 'Modal_Price' in df.columns:
        rename_map['Modal_Price'] = 'modal_price'
    elif 'modal_price' in df.columns:
        rename_map['modal_price'] = 'modal_price'

    if 'Commodity' in df.columns:
        rename_map['Commodity'] = 'crop'
    elif 'crop' in df.columns:
        rename_map['crop'] = 'crop'

    # Rename execute karo
    df = df.rename(columns=rename_map)
    
    # Check: Kya 'date' column ban gaya?
    if 'date' not in df.columns:
        print("\n❌ CRITICAL ERROR: CSV mein Date column nahi mila!")
        print("Humein 'Price Date' ya 'arrival_date' chahiye.")
        print("Aapki CSV mein ye columns hain:", list(df.columns))
        exit()

    # 4. Date Convert
    print("✅ Date column mil gaya! Converting...")
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date']) 
    df = df.sort_values('date')
    
    print(f"✅ Data Ready! Total Rows: {len(df)}")
    
except Exception as e:
    print(f"❌ Error loading CSV: {e}")
    exit()

# --- FEATURE ENGINEERING ---
def create_features(df):
    df = df.copy()
    df['day_of_year'] = df['date'].dt.dayofyear
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['lag_1'] = df['modal_price'].shift(1)
    df['lag_7'] = df['modal_price'].shift(7)
    df['lag_30'] = df['modal_price'].shift(30)
    df['rolling_mean_7'] = df['modal_price'].rolling(window=7).mean()
    df['rolling_std_7'] = df['modal_price'].rolling(window=7).std()
    df = df.dropna()
    return df

target_crops = ['Wheat', 'Rice', 'Garlic', 'Onion', 'Potato', 'Tomato']

print("\n🚀 Starting XGBoost Training...")

for crop in target_crops:
    # Crop search (Case insensitive)
    if 'crop' not in df.columns:
        print("❌ Error: 'crop' column missing.")
        break
        
    crop_data = df[df['crop'].str.contains(crop, case=False, na=False)]
    
    if len(crop_data) < 50:
        print(f"⚠️ Skipping {crop}: Not enough data ({len(crop_data)} rows)")
        continue

    print(f"🌱 Training {crop}...")
    
    processed_data = create_features(crop_data)
    
    if processed_data.empty:
        continue

    features = ['day_of_year', 'month', 'year', 'lag_1', 'lag_7', 'lag_30', 'rolling_mean_7', 'rolling_std_7']
    X = processed_data[features]
    y = processed_data['modal_price']
    
    split_idx = int(len(X) * 0.90)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    
    model = xgb.XGBRegressor(n_estimators=1000, learning_rate=0.01, max_depth=5, n_jobs=-1)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    
    print(f"   ✅ Saved! Error: ₹{mae:.2f}")
    joblib.dump(model, f"models/xgb_{crop.lower()}.pkl")

print("\n✨ Mission Complete! Models Saved.")