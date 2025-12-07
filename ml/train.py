import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

# Folder check
if not os.path.exists("models"):
    os.makedirs("models")

print("🔄 Loading Real Mandi Data (Kaggle CSV)...")

try:
    # 1. Load CSV
    df = pd.read_csv("data/mandi_history.csv")
    
    # Column ke naam saaf karo (Extra spaces hatao)
    df.columns = df.columns.str.strip()
    
    print("📊 Columns found in CSV:", list(df.columns))

    # 2. Smart Rename (Kaggle Column names handle karne ke liye)
    rename_map = {
        'Price Date': 'date',       # Kaggle name -> Our name
        'Modal_Price': 'modal_price',
        'Commodity': 'crop',
        'District Name': 'district_name',
        'Market Name': 'market_name',
        # Fallbacks (Agar purani file ho)
        'arrival_date': 'date',
        'modal_price': 'modal_price',
        'crop': 'crop'
    }
    
    df = df.rename(columns=rename_map)
    
    # Check agar 'date' column ban gaya ya nahi
    if 'date' not in df.columns:
        print("❌ Error: 'Price Date' column nahi mila!")
        print("CSV mein ye columns hain:", list(df.columns))
        exit()

    # 3. Date Conversion
    # 'errors=coerce' ka matlab agar koi date kharab hai to use NaT bana do (error mat do)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date']) # Kharab dates hatao
    df = df.sort_values('date')
    
    print(f"✅ Data Loaded Successfully! Total Rows: {len(df)}")
    
except Exception as e:
    print(f"❌ Critical Error loading CSV: {e}")
    exit()

def create_features(df):
    df = df.copy()
    
    # 1. Time Features
    df['day_of_year'] = df['date'].dt.dayofyear
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    
    # 2. Lag Features (History)
    df['lag_1'] = df['modal_price'].shift(1)
    df['lag_7'] = df['modal_price'].shift(7)
    df['lag_30'] = df['modal_price'].shift(30)
    
    # 3. Rolling Statistics
    df['rolling_mean_7'] = df['modal_price'].rolling(window=7).mean()
    df['rolling_std_7'] = df['modal_price'].rolling(window=7).std()
    
    df = df.dropna()
    return df

# Target Crops
target_crops = ['Wheat', 'Rice', 'Garlic', 'Onion', 'Potato', 'Tomato']

print("🚀 Training XGBoost Models...")

for crop in target_crops:
    # Filter Crop (Case insensitive)
    crop_data = df[df['crop'].str.contains(crop, case=False, na=False)]
    
    if len(crop_data) < 50:
        print(f"⚠️ Skipping {crop}: Not enough data ({len(crop_data)} rows)")
        continue

    print(f"\n🌱 Training for: {crop} ({len(crop_data)} rows)...")
    
    processed_data = create_features(crop_data)
    
    if processed_data.empty:
        print("   ❌ Data too short for features.")
        continue

    features = ['day_of_year', 'month', 'year', 'lag_1', 'lag_7', 'lag_30', 'rolling_mean_7', 'rolling_std_7']
    X = processed_data[features]
    y = processed_data['modal_price']
    
    # Split Data
    split_idx = int(len(X) * 0.90)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    
    # Train XGBoost
    model = xgb.XGBRegressor(n_estimators=1000, learning_rate=0.01, max_depth=5, n_jobs=-1)
    
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    
    # Evaluate
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    
    print(f"   ✅ Saved! Avg Error: ₹{mae:.2f}")
    joblib.dump(model, f"models/xgb_{crop.lower()}.pkl")

print("\n✨ All Price Models Trained Successfully!")