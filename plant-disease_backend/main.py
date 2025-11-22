from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torchvision.transforms as transforms
import torchvision.models as models
import torch.nn as nn
import io
import os

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------------
# 38 CLASSES (PlantVillage)
# -----------------------------
classes = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Corn_(maize)___Cercospora_leaf_spot",
    "Corn_(maize)___Common_rust",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___healthy",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___healthy",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites_Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Raspberry___healthy"
]

# --------------------------------------
# COMPLETE DISEASE DETAILS FOR ALL 38
# --------------------------------------
disease_info = {

    # APPLE
    "Apple___Apple_scab": {
        "Plant": "Apple",
        "Disease": "Apple Scab",
        "Root Cause": "Fungus Venturia inaequalis",
        "Symptoms": [
            "Olive-green or brown spots",
            "Leaf distortion",
            "Premature leaf shedding"
        ],
        "Treatment": [
            "Apply fungicides",
            "Remove infected leaves",
            "Improve ventilation"
        ]
    },
    "Apple___Black_rot": {
        "Plant": "Apple",
        "Disease": "Apple Black Rot",
        "Root Cause": "Fungus Botryosphaeria obtusa",
        "Symptoms": [
            "Purple spots on leaves",
            "Fruiting body rot",
            "Branch cankers"
        ],
        "Treatment": [
            "Prune infected branches",
            "Apply copper fungicides",
            "Burn infected debris"
        ]
    },
    "Apple___Cedar_apple_rust": {
        "Plant": "Apple",
        "Disease": "Cedar Apple Rust",
        "Root Cause": "Fungus Gymnosporangium juniperi-virginianae",
        "Symptoms": [
            "Bright yellow-orange leaf spots",
            "Defoliation",
            "Fruit deformity"
        ],
        "Treatment": [
            "Remove cedar trees nearby",
            "Use rust-resistant varieties",
            "Apply fungicides"
        ]
    },
    "Apple___healthy": {
        "Plant": "Apple",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # BLUEBERRY
    "Blueberry___healthy": {
        "Plant": "Blueberry",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # CHERRY
    "Cherry_(including_sour)___healthy": {
        "Plant": "Cherry",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "Plant": "Cherry",
        "Disease": "Powdery Mildew",
        "Root Cause": "Fungal spread in humid conditions",
        "Symptoms": [
            "White powdery coating",
            "Leaf distortion",
            "Reduced fruit yield"
        ],
        "Treatment": [
            "Use sulfur spray",
            "Remove infected leaves",
            "Increase airflow"
        ]
    },

    # CORN
    "Corn_(maize)___Cercospora_leaf_spot": {
        "Plant": "Corn",
        "Disease": "Cercospora Leaf Spot",
        "Root Cause": "Fungus Cercospora zeae-maydis",
        "Symptoms": ["Grayish brown lesions", "Yellow halo spots"],
        "Treatment": ["Use resistant varieties", "Crop rotation"]
    },
    "Corn_(maize)___Common_rust": {
        "Plant": "Corn",
        "Disease": "Common Rust",
        "Root Cause": "Fungus Puccinia sorghi",
        "Symptoms": ["Reddish-brown pustules", "Leaf damage"],
        "Treatment": ["Apply fungicides"]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "Plant": "Corn",
        "Disease": "Northern Leaf Blight",
        "Root Cause": "Fungus Exserohilum turcicum",
        "Symptoms": ["Cigar-shaped lesions"],
        "Treatment": ["Fungicides", "Resistance hybrids"]
    },
    "Corn_(maize)___healthy": {
        "Plant": "Corn",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # GRAPE
    "Grape___Black_rot": {
        "Plant": "Grape",
        "Disease": "Black Rot",
        "Root Cause": "Fungus Guignardia bidwellii",
        "Symptoms": ["Black spots", "Leaf holes"],
        "Treatment": ["Prune infected parts", "Fungicides"]
    },
    "Grape___Esca_(Black_Measles)": {
        "Plant": "Grape",
        "Disease": "Esca (Black Measles)",
        "Root Cause": "Fungal complex infection",
        "Symptoms": ["Tiger-striped leaves"],
        "Treatment": ["Remove infected vines"]
    },
    "Grape___healthy": {
        "Plant": "Grape",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "Plant": "Grape",
        "Disease": "Leaf Blight",
        "Root Cause": "Isariopsis fungus",
        "Symptoms": ["Angular leaf spots"],
        "Treatment": ["Fungicides"]
    },

    # ORANGE
    "Orange___Haunglongbing_(Citrus_greening)": {
        "Plant": "Orange",
        "Disease": "Citrus Greening",
        "Root Cause": "Bacterial infection via psyllids",
        "Symptoms": ["Yellow shoots", "Distorted fruits"],
        "Treatment": ["No cure — remove infected trees"]
    },

    # PEACH
    "Peach___Bacterial_spot": {
        "Plant": "Peach",
        "Disease": "Bacterial Spot",
        "Root Cause": "Xanthomonas bacteria",
        "Symptoms": ["Water-soaked lesions"],
        "Treatment": ["Copper sprays"]
    },
    "Peach___healthy": {
        "Plant": "Peach",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # PEPPER
    "Pepper,_bell___Bacterial_spot": {
        "Plant": "Bell Pepper",
        "Disease": "Bacterial Spot",
        "Root Cause": "Xanthomonas campestris",
        "Symptoms": ["Dark greasy leaf spots"],
        "Treatment": ["Copper fungicides"]
    },
    "Pepper,_bell___healthy": {
        "Plant": "Bell Pepper",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # POTATO
    "Potato___Early_blight": {
        "Plant": "Potato",
        "Disease": "Early Blight",
        "Root Cause": "Fungus Alternaria solani",
        "Symptoms": ["Target-like spots"],
        "Treatment": ["Fungicides"]
    },
    "Potato___Late_blight": {
        "Plant": "Potato",
        "Disease": "Late Blight",
        "Root Cause": "Phytophthora infestans",
        "Symptoms": ["Dark lesions"],
        "Treatment": ["Destroy infected plants"]
    },
    "Potato___healthy": {
        "Plant": "Potato",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # STRAWBERRY
    "Strawberry___Leaf_scorch": {
        "Plant": "Strawberry",
        "Disease": "Leaf Scorch",
        "Root Cause": "Fungal infection",
        "Symptoms": ["Dark leaf spots", "Red margins"],
        "Treatment": ["Remove infected leaves"]
    },
    "Strawberry___healthy": {
        "Plant": "Strawberry",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # TOMATO (multiple diseases)
    "Tomato___Bacterial_spot": {
        "Plant": "Tomato",
        "Disease": "Bacterial Spot",
        "Root Cause": "Xanthomonas",
        "Symptoms": ["Brown leaf spots"],
        "Treatment": ["Copper treatments"]
    },
    "Tomato___Early_blight": {
        "Plant": "Tomato",
        "Disease": "Early Blight",
        "Root Cause": "Alternaria solani",
        "Symptoms": ["Ring-like spots"],
        "Treatment": ["Fungicides"]
    },
    "Tomato___healthy": {
        "Plant": "Tomato",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },
    "Tomato___Late_blight": {
        "Plant": "Tomato",
        "Disease": "Late Blight",
        "Root Cause": "Phytophthora infestans",
        "Symptoms": ["Water-soaked lesions"],
        "Treatment": ["Destroy infected plants"]
    },
    "Tomato___Leaf_Mold": {
        "Plant": "Tomato",
        "Disease": "Leaf Mold",
        "Root Cause": "Fungus Passalora fulva",
        "Symptoms": ["Greenish spots"],
        "Treatment": ["Reduce humidity"]
    },
    "Tomato___Septoria_leaf_spot": {
        "Plant": "Tomato",
        "Disease": "Septoria Leaf Spot",
        "Root Cause": "Septoria lycopersici",
        "Symptoms": ["Circular leaf spots"],
        "Treatment": ["Remove debris"]
    },
    "Tomato___Spider_mites_Two-spotted_spider_mite": {
        "Plant": "Tomato",
        "Disease": "Spider Mites",
        "Root Cause": "Mite infestation",
        "Symptoms": ["Yellow speckling"],
        "Treatment": ["Neem oil"]
    },
    "Tomato___Target_Spot": {
        "Plant": "Tomato",
        "Disease": "Target Spot",
        "Root Cause": "Corynespora cassiicola",
        "Symptoms": ["Target-like lesions"],
        "Treatment": ["Fungicides"]
    },
    "Tomato___Tomato_mosaic_virus": {
        "Plant": "Tomato",
        "Disease": "TMV Virus",
        "Root Cause": "Tobacco Mosaic Virus",
        "Symptoms": ["Mosaic patterns"],
        "Treatment": ["Remove infected plants"]
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "Plant": "Tomato",
        "Disease": "TYLCV Virus",
        "Root Cause": "Whitefly transmission",
        "Symptoms": ["Leaf curling"],
        "Treatment": ["Use pest control"]
    },

    # SOYBEAN
    "Soybean___healthy": {
        "Plant": "Soybean",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    },

    # SQUASH
    "Squash___Powdery_mildew": {
        "Plant": "Squash",
        "Disease": "Powdery Mildew",
        "Root Cause": "Fungal infection",
        "Symptoms": ["White powder"],
        "Treatment": ["Use sulfur spray"]
    },

    # RASPBERRY
    "Raspberry___healthy": {
        "Plant": "Raspberry",
        "Disease": "Healthy",
        "Root Cause": "None",
        "Symptoms": ["No symptoms"],
        "Treatment": ["No treatment needed"]
    }
}

num_classes = len(classes)

# ----------------------------
# Load ResNet50 Model
# ----------------------------
model_path = os.path.join(os.path.dirname(__file__), "model.pth")

model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
model.fc = nn.Linear(model.fc.in_features, num_classes)

state_dict = torch.load(model_path, map_location="cpu")
model.load_state_dict(state_dict)
model.eval()

print("🔥 Model Loaded Successfully!")

# ----------------------------
# Prediction API
# ----------------------------
@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])

    img_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = torch.max(outputs, 1)
        predicted_class = classes[predicted.item()]

    details = disease_info.get(predicted_class, {})

    print("Predicted:", predicted_class)
    print("Details:", details)

    return {
        "prediction": predicted_class,
        "details": details
    }

# ----------------------------
# Run Server
# ----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
