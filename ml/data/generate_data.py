# ml/data/generate_data.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 5 saal ka fake data banayenge for Garlic in Sehore
start_date = datetime(2020, 1, 1)
dates = [start_date + timedelta(days=x) for x in range(1500)]

data = []
for date in dates:
    # Seasonality logic (Winter me sasta, Summer me mehenga example)
    month = date.month
    base_price = 40
    
    # Simple seasonal effect
    seasonality = np.sin(2 * np.pi * month / 12) * 10
    
    # Thoda random noise
    noise = np.random.normal(0, 5)
    
    # Trend (har saal thoda price badh raha hai)
    trend = (date.year - 2020) * 2
    
    final_price = base_price + seasonality + trend + noise
    
    # Price negative nahi ho sakta
    final_price = max(10, final_price)
    
    data.append({
        "date": date,
        "district": "Sehore",
        "crop": "Garlic",
        "price": round(final_price, 2)
    })

df = pd.DataFrame(data)
df.to_csv("garlic_sehore_v1.csv", index=False)
print("✅ Sample Data Generated: garlic_sehore_v1.csv")