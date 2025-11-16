## 🗂️ **LeafGreen — Project Structure**

```
LeafGreen/
│
├── data/
│   ├── raw/             # Original dataset (unmodified)
│   └── processed/       # Cleaned, resized, or augmented images
│
├── notebooks/
│   ├── 01_data_preparation.ipynb        # Data loading, cleaning, and visualization
│   ├── 02_model_training.ipynb   # Model creation & training
│   ├── 03_evaluation.ipynb       # Model testing and metrics
│   └── 04_inference.ipynb        # Predict disease on new leaf images
│
├── src/
│   ├── __init__.py
│   ├── model.py          # CNN or transfer learning model
│   ├── utils.py          # Helper functions (image preprocessing, plotting)
│
├── models/
│   └── leafgreen_cnn.pth # Saved trained model
│
├── outputs/
│   ├── logs/
│   └── results/
│
├── README.md
├── requirements.txt
└── .gitignore
```

---

## 🪶 **What Each Part Does**

| Folder/File        | Purpose                                                                  |
| ------------------ | ------------------------------------------------------------------------ |
| `data/`            | Store datasets (keep large raw data out of GitHub if possible).          |
| `notebooks/`       | Your main Jupyter workflows (EDA → Training → Testing).                  |
| `src/model.py`     | Contains the reusable model definition (you can import it in notebooks). |
| `src/utils.py`     | For helper functions like image resizing, accuracy calculation, etc.     |
| `models/`          | Store trained model weights (`.pth` or `.h5` files).                     |
| `outputs/`         | Keep results, graphs, or metrics saved from runs.                        |
| `README.md`        | Explains your project and how to run it.                                 |
| `.gitignore`       | Keeps large or temporary files out of Git.                               |
| `requirements.txt` | Contains all Python dependencies.                                        |
