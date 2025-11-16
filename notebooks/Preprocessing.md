# **Explanation of Data Preprocessing Code (LeafGreen Project)**

Below is a clean and readable explanation of what each part of the preprocessing script does.

---

# **1. Importing required libraries**

```python
import os
import shutil
from sklearn.model_selection import train_test_split
from PIL import Image
from tqdm import tqdm
```

### Explanation:

* **os** → handle folders, file paths.
* **shutil** → file copying/moving (not used heavily but useful).
* **train_test_split** → split images into train/val/test sets randomly.
* **PIL.Image** → open and resize images.
* **tqdm** → display progress bars during preprocessing.

---

# **2. Defining project paths**

```python
BASE_DIR = os.path.abspath("..")
RAW_COLOR = os.path.join(BASE_DIR, "data", "raw", "plantvillage_dataset", "color")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

TRAIN_DIR = os.path.join(PROCESSED_DIR, "train")
VAL_DIR   = os.path.join(PROCESSED_DIR, "val")
TEST_DIR  = os.path.join(PROCESSED_DIR, "test")

for d in [TRAIN_DIR, VAL_DIR, TEST_DIR]:
    os.makedirs(d, exist_ok=True)
```

### Explanation:

* **BASE_DIR** → points to project root folder (`LeafGreen/`).
* **RAW_COLOR** → path to the *color* images from PlantVillage dataset.
* **PROCESSED_DIR** → output directory where cleaned data will be stored.
* Creates:

  * `processed/train`
  * `processed/val`
  * `processed/test`
* `exist_ok=True` ensures no errors if folders already exist.

---

# **3. Getting all class names**

```python
classes = sorted(os.listdir(RAW_COLOR))
print("Total classes:", len(classes))
```

### Explanation:

* Each class folder contains images of a **plant + disease**.
* e.g. `Apple___Black_rot`, `Tomato___Late_blight`, etc.
* `os.listdir()` reads all those folder names.
* `sorted()` just makes them alphabetical.

---

# **4. Resizing + splitting with train/val/test**

```python
IMAGE_SIZE = (224, 224)

for cls in tqdm(classes):
    src_folder = os.path.join(RAW_COLOR, cls)

    images = os.listdir(src_folder)
    train_imgs, temp = train_test_split(images, test_size=0.2, random_state=42)
    val_imgs, test_imgs = train_test_split(temp, test_size=0.5, random_state=42)

    for split in [TRAIN_DIR, VAL_DIR, TEST_DIR]:
        os.makedirs(os.path.join(split, cls), exist_ok=True)

    for split, img_list in [
        (TRAIN_DIR, train_imgs),
        (VAL_DIR, val_imgs),
        (TEST_DIR, test_imgs),
    ]:
        for img in img_list:
            src = os.path.join(src_folder, img)
            dest = os.path.join(split, cls, img)

            try:
                im = Image.open(src).convert("RGB")
                im = im.resize(IMAGE_SIZE)
                im.save(dest)
            except:
                print("Error loading:", src)
                continue
```

### Explanation:

### **A. 224×224 resizing**

ResNet50 requires input images of size **224×224**, so every image is resized to that dimension.

### **B. Train/Val/Test Split**

* `train_test_split(images, test_size=0.2)`
  → 80% training, 20% remaining.

* split the remaining 20% into:

  * 10% validation
  * 10% test

This results in:

* **80% training**
* **10% validation**
* **10% test**

### **C. Creating target class folders**

For each class, inside:

* `processed/train/<class>/`
* `processed/val/<class>/`
* `processed/test/<class>/`

### **D. Processing + saving images**

For each image:

1. **Open image**
2. **Convert to RGB**
   (ensures consistency even if original is grayscale or PNG with alpha)
3. **Resize to 224×224**
4. **Save image into processed directory**

If an image is corrupted → it prints an error and skips it.

---

# **5. Final message**

```python
print("Preprocessing complete ")
```

### Explanation:

Indicates that all images have been cleaned, resized, split, and saved.

---

# **Overall Purpose of the Script**

This preprocessing code takes our raw PlantVillage dataset and converts it into a **clean, structured, machine learning–ready format**, specifically tailored for **ResNet50 training**.

### After running this notebook, we now have:

```
data/processed/
   train/
      class_a/
      class_b/
   val/
   test/
```
