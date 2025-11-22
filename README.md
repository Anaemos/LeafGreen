# **LeafGreen: Plant Species & Disease Classification Using Deep Learning**

LeafGreen is a PyTorch-based deep learning project that identifies **plant species** and detects **leaf diseases** from images.
The model is trained on the well-known **PlantVillage** dataset and achieves an accuracy of **99%+** using **ResNet50** transfer learning.

---

## **Project Structure**

```
LeafGreen/
│
├── data/
│   ├── raw/               # Original dataset (ignored by Git)
│   └── processed/         # Preprocessed train/val/test splits (ignored by Git)
│
├── notebooks/
│   ├── 01_data_preparation.ipynb
│   ├── 02_model_training.ipynb
│   ├── 03_evaluation.ipynb
│
├── models/
│   └── model.pth   # Final trained model
│
├── outputs/
│   ├── results/           # Evaluation outputs, confusion matrix
│   └── logs/
│
├── plant-disease-frontend/
|   ├── public/
|   ├── src/
|   ├── index.html
|   ├── package-lock.json
|   ├── package.json
|   ├── vite.config.js
|
├── plant-disease_backend/
|   ├── main.py
|
├── requirements.txt
└── README.md
```
(Project structure is not exactly as in local machine)
---

# **1. Introduction**

Agricultural productivity is heavily impacted by plant diseases.
Manual diagnosis by experts is slow, subjective, and not scalable.

**LeafGreen** automates this process using deep learning.
The system can:

✔ Classify the **plant species**
✔ Detect whether the leaf is **healthy or diseased**
✔ Identify **specific diseases** across 38 classes

This makes LeafGreen suitable for farmers, agri-tech companies, researchers, and mobile app deployment.

---

# **2. Dataset: PlantVillage**

The project uses the **Color subset** of PlantVillage dataset (largest, best-performing).

### **Total Classes: 38**

Examples:

* Apple: *Apple Scab, Black Rot, Cedar Rust, Healthy*
* Cherry: *Powdery Mildew, Healthy*
* Corn: *Cercospora Leaf Spot, Rust, Leaf Blight, Healthy*
* Grape: *Black Rot, Esca, Leaf Blight, Healthy*
* Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry
* Tomato: *9 different diseases + Healthy*

Grayscale & segmented datasets were NOT used for main training (optional for experiments).

---

#  **3. Preprocessing**

Performed in
 `01_data_preparation.ipynb`

### Steps:

1. Use only **color/** samples
2. Train/Validation/Test split: **80/10/10**
3. Preserve class balance
4. Resize all images → **224×224** (ResNet50 standard)
5. Save into:

```
processed/train/
processed/val/
processed/test/
```

---

# **4. Model: ResNet50**

ResNet50 is a deep CNN with **skip connections** (“residual connections”).

### Why ResNet50?

* Extremely stable for deep architectures
* Prevents vanishing gradients
* Pretrained on ImageNet → faster convergence
* Strong performance on agricultural image datasets
* Good balance between accuracy and computation

### Skip Connection Intuition

Imagine writing a long sentence and adding reminders so you don’t forget earlier points.
ResNet does the same:
It lets gradients “skip” layers and flow directly backward → stronger learning.

---

# **5. Training**

Performed in
 `02_model_training.ipynb`
(using Google Colab GPU)

### Key points:

* Loss function: **CrossEntropyLoss**
* Optimizer: **Adam**
* Learning rate: **1e-4**
* Epochs: **10**
* Augmentations: Rotation, HorizontalFlip
* Best model saved as:
  `models/leafgreen_model.pth`

---

# **6. Evaluation**

Performed in
`03_evaluation.ipynb`

Metrics used:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix

### Result:

 **99.39% accuracy** on test set

Model performs exceptionally well across all classes.

Confusion matrix and sample predictions confirm strong generalization.


---

#  **7. How to Run**

### Step 1 — Install dependencies

```
pip install -r requirements.txt
```

### Step 2 — Ensure dataset is placed in:

```
data/processed/
```

### Step 3 — Run evaluation/inference notebooks

---

# **8. Technologies Used**

| Component       | Tech Used            |
| --------------- | -------------------- |
| Language        | Python               |
| Deep Learning   | PyTorch, TorchVision |
| Training        | Google Colab GPU     |
| Visualization   | Matplotlib, Seaborn  |
| Dataset         | PlantVillage (Color) |
| Version Control | Git + GitHub         |

---

# **9. What We Learned**

* Proper ML project structuring
* Creating reproducible virtual environments
* Image preprocessing and augmentation
* Transfer learning using ResNet50
* Managing large datasets with Google Colab
* Saving/loading PyTorch models (`.pth`)
* Evaluation metrics & confusion matrix analysis
* GitHub collaboration with large projects

---

# **10. Future Improvements**

* Deploy as Web App using FastAPI
* Mobile inference using ONNX
* Add Grad-CAM heatmaps
* Disease severity estimation
* Use Vision Transformers for larger dataset



