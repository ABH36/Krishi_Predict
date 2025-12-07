import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import json

# --- CONFIGURATION (Settings) ---
# Aapke bataye hue folder structure ke hisaab se path:
DATASET_DIR = "dataset/PlantVillage/color" 
MODEL_SAVE_PATH = "models/plant_disease_model.h5"
CLASS_INDICES_PATH = "models/class_indices.json"

# Check agar folder exist karta hai
if not os.path.exists(DATASET_DIR):
    print(f"❌ Error: Dataset folder nahi mila!")
    print(f"Dhoondha gaya path: {os.path.abspath(DATASET_DIR)}")
    print("Kripya check karein ki 'dataset/PlantVillage/color' folder sahi jagah par hai.")
    exit()

# 1. Image Preprocessing & Augmentation
# (Images ko thoda ghuma-phira kar train karenge taaki model har angle se pehchan sake)
train_datagen = ImageDataGenerator(
    rescale=1./255,        # Pixel value 0-1 ke beech lao (Normalization)
    rotation_range=20,     # Photo ko thoda ghuma kar dekho
    width_shift_range=0.2, # Thoda side mein khiskao
    height_shift_range=0.2,
    horizontal_flip=True,  # Mirror image bhi seekho
    fill_mode='nearest',
    validation_split=0.2   # 20% data testing (validation) ke liye rakho
)

print(f"🔄 Images load ho rahi hain: {DATASET_DIR} se...")

# Training Data Loader
train_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(150, 150), # Image size fix karo (Speed vs Quality balance)
    batch_size=32,
    class_mode='categorical',
    subset='training'
)

# Validation Data Loader (Test)
validation_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(150, 150),
    batch_size=32,
    class_mode='categorical',
    subset='validation'
)

# Check Classes
class_names = list(train_generator.class_indices.keys())
print(f"✅ Total {len(class_names)} Bimariyan (Classes) mili hain:")
print(class_names[:5], "...") # Shuru ki 5 dikhao

# 2. Build Advanced CNN Model (The Brain)
model = models.Sequential([
    # Layer 1: Aankhen (Features detect karega - Edges, Colors)
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 3)),
    layers.MaxPooling2D((2, 2)),
    
    # Layer 2: Aur gehrai se dekho (Shapes, Patterns)
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Layer 3: Complex Features (Texture, Disease Spots)
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Layer 4: High Level Features
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Flatten: Image ko ek lambi list mein badlo
    layers.Flatten(),
    
    # Dense Layer: Sochne wala hissa
    layers.Dense(512, activation='relu'),
    layers.Dropout(0.5), # 50% neurons band karo taaki ratta na maare (Overfitting)
    
    # Output Layer: Faisla lo
    layers.Dense(len(class_names), activation='softmax')
])

# 3. Compile Model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# 4. Start Training
print("\n🚀 Training Shuru! (Isme 10-15 minute lagenge, chai pi lo ☕)")
print("Model seekh raha hai...")

history = model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // 32,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // 32,
    epochs=10 # Real production ke liye 20-30 rakh sakte hain, abhi 10 kaafi hai
)

# 5. Save Model & Class Names
if not os.path.exists("models"):
    os.makedirs("models")

# Model File (.h5)
model.save(MODEL_SAVE_PATH)
print(f"🎉 AI Model Saved: {MODEL_SAVE_PATH}")

# Class Names (.json) - Ye serve.py mein kaam aayega naam batane ke liye
with open(CLASS_INDICES_PATH, "w") as f:
    json.dump(train_generator.class_indices, f)
print(f"✅ Class Index Saved: {CLASS_INDICES_PATH}")

print("\nMission Complete! Ab 'serve.py' is model ko use kar sakta hai.")