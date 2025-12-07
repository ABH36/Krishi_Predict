import pandas as pd

# CSV load karo
df = pd.read_csv("data/mandi_history.csv")
df.columns = df.columns.str.strip() # Space hatao

# Commodity column ka naam check karo
col_name = 'Commodity' if 'Commodity' in df.columns else 'crop'

# Saare unique naam print karo jo 'Ga' ya 'La' se shuru hote hain
unique_crops = df[col_name].unique()
print("\n🔍 Fasal ke naam (Check karo Garlic kaise likha hai):")
for name in unique_crops:
    name_str = str(name).lower()
    if 'garl' in name_str or 'lah' in name_str or 'lus' in name_str:
        print(f"👉 Found: {name}")