# ml/seed_data.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Data save karne ke liye folder
os.makedirs("data", exist_ok=True)

def generate_crop_data(crop_name, base_price, volatility, seasonality_factor):
    # 2 saal ka data (730 din)
    days = 730
    dates = [datetime.today() - timedelta(days=x) for x in range(days)]
    dates.reverse() # Purane se naya
    
    prices = []
    
    for i, date in enumerate(dates):
        # 1. Seasonality (Saal mein ek baar price badhega)
        # Mahine ke hisaab se sine wave (Prices rise in mid-year)
        month_effect = np.sin(2 * np.pi * date.month / 12) * seasonality_factor
        
        # 2. Trend (Thoda sa inflation)
        trend = i * 0.01 
        
        # 3. Random Noise (Roz ka utaar-chadhaav)
        noise = np.random.normal(0, volatility)
        
        final_price = base_price + month_effect + trend + noise
        
        # Price negative nahi ho sakta
        final_price = max(final_price, base_price * 0.5)
        
        prices.append({
            "date": date.strftime("%Y-%m-%d"),
            "crop": crop_name,
            "district": "Sehore",
            "state": "Madhya Pradesh",
            "price": round(final_price, 2)
        })
    
    return prices

# 3 Crops ka data banate hain
print("Generating Data...")
data_wheat = generate_crop_data("wheat", base_price=2200, volatility=50, seasonality_factor=200) # Prices per Quintal
data_rice = generate_crop_data("rice", base_price=3000, volatility=80, seasonality_factor=300)
data_garlic = generate_crop_data("garlic", base_price=12000, volatility=500, seasonality_factor=4000) # High fluctuation

all_data = data_wheat + data_rice + data_garlic

# DataFrame banakar CSV save karo
df = pd.DataFrame(all_data)
df.to_csv("data/mandi_history.csv", index=False)

print("✅ Success! 'ml/data/mandi_history.csv' file ban gayi hai.")
print("Isme 2 saal ka realistic data hai.")