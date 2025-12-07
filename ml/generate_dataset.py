# ml/generate_dataset.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

if not os.path.exists("data"):
    os.makedirs("data")

def generate_smart_data(crop, start_price, volatility, seasonal_peak_month):
    start_date = datetime(2020, 1, 1) # 4 Saal ka data
    end_date = datetime(2025, 12, 1)
    days = (end_date - start_date).days
    
    data = []
    
    current_price = start_price
    
    # Random Walk Simulation with External Factors
    for i in range(days):
        date = start_date + timedelta(days=i)
        month = date.month
        
        # 1. Seasonality (Sine Wave)
        season_effect = np.sin(2 * np.pi * (month - seasonal_peak_month) / 12) * 5
        
        # 2. Rainfall (Simulated) - Monsoon (June-Sept)
        is_monsoon = 6 <= month <= 9
        rainfall = np.random.uniform(5, 50) if is_monsoon else np.random.uniform(0, 5)
        
        # Logic: Zyada barish = Achhi fasal = Thoda price drop (Long term)
        rain_effect = -0.05 * rainfall if is_monsoon else 0.01
        
        # 3. Diesel Price (Inflation)
        # Maan lo diesel roz thoda badh raha hai
        diesel_price = 80 + (i * 0.02) + np.random.normal(0, 0.5)
        transport_cost_effect = (diesel_price - 80) * 0.1 # Cost badhi to bhav badha
        
        # 4. Market Volatility (Shock)
        market_shock = np.random.normal(0, volatility)
        
        # Final Price Calculation
        # Price = Kal ka Price + Season + Rain Impact + Transport Cost + Random Shock
        daily_fluctuation = (market_shock / 100) * current_price
        
        current_price = current_price + daily_fluctuation + (season_effect * 0.1) + rain_effect + (transport_cost_effect * 0.05)
        current_price = max(current_price, start_price * 0.5) # Minimum limit
        
        data.append({
            "arrival_date": date.strftime('%d/%m/%Y'),
            "modal_price": round(current_price, 2),
            "crop": crop,
            "district_name": "Sehore",
            "rainfall": round(rainfall, 1),
            "diesel_price": round(diesel_price, 1)
        })
        
    return pd.DataFrame(data)

print("🚀 Generating Advanced 4-Year Dataset...")

# Wheat: Peak Nov (Sowing), Harvest April
df_wheat = generate_smart_data("Wheat", 2200, 1.2, seasonal_peak_month=11)

# Garlic: High Volatility
df_garlic = generate_smart_data("Garlic", 9000, 4.0, seasonal_peak_month=9)

# Rice
df_rice = generate_smart_data("Rice", 3000, 1.0, seasonal_peak_month=7)

full_df = pd.concat([df_wheat, df_garlic, df_rice])
full_df.to_csv("data/mandi_history.csv", index=False)

print("✅ Advanced Dataset Created with Rainfall & Fuel Factors!")