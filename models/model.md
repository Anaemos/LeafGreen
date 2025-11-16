# **LeafGreen — Model Training Explanation (MD for Viva / Report)**

## **1. Model Used: ResNet-50**

For LeafGreen, we used **ResNet-50**, a deep Convolutional Neural Network with 50 layers.
It is a standard, widely-used architecture for image classification tasks and is known for:

* Residual connections (skip connections) → prevent vanishing gradients
* Strong transfer learning capability
* Good performance on medium-sized datasets
* Stable training behaviour

We used **ImageNet-pretrained weights** and fine-tuned the network for our dataset.

---

## **2. Why ResNet-50 for LeafGreen**

ResNet-50 is ideal for a plant disease detection system because:

* Leaves have fine texture patterns → ResNet handles them well
* Dataset size fits perfectly with transfer learning
* Much faster to train on Colab GPU vs larger models (EfficientNetB7, ViT)
* Excellent accuracy for PlantVillage dataset (~98–99% achievable)

---

## **3. Dataset Used**

We used the **PlantVillage Color Dataset**, which contains ~54,000 images of plant leaves across **38 classes**, including:

* Different plant types (Apple, Tomato, Corn, Grape, Potato, etc.)
* Each plant has healthy + diseased variations

Examples of classes:

* *Apple___Apple_scab*
* *Grape___Black_rot*
* *Tomato___Leaf_Mold*
* *Corn_(maize)___Northern_Leaf_Blight*
* *Potato___Early_blight*
* *Tomato___Yellow_Leaf_Curl_Virus*
* And many more…

This dataset is well-structured and commonly used in plant pathology deep learning research.

---

## **4. Data Preprocessing**

Preprocessing was done **locally in Jupyter**, and training happened in **Google Colab**.

Steps performed:

### **4.1 Selection of Color Images Only**

From the dataset we used only:

```
plantvillage_dataset/color/
```

Because grayscale and segmented versions lack background/context information.

### **4.2 Train/Validation/Test Split (80/10/10)**

Each class folder was split **individually**, ensuring:

* Every class has images in train/val/test
* No class is missing from test set
* Balanced class distribution across splits

### **4.3 Image Preprocessing**

Every image was:

* Loaded with PIL
* Converted to RGB
* Resized to **224×224** (ResNet input size)
* Normalized implicitly via transforms (in training)

The final folder structure became (in colab, different in local/jupyter):

```
processed/
   train/<38 classes>
   val/<38 classes>
   test/<38 classes>
```

---

## **5. Data Loading (PyTorch)**

In Colab, we loaded the processed folders using:

```python
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
```

with transforms:

### **Training Transforms**

```python
transforms.Resize((224, 224)),
transforms.RandomHorizontalFlip(),
transforms.RandomRotation(15),
transforms.ToTensor()
```

### **Validation/Test Transforms**

```python
transforms.Resize((224, 224)),
transforms.ToTensor()
```

Batch size used:

```
BATCH_SIZE = 32
```

---

## **6. Model Architecture Setup**

We loaded pretrained ResNet-50:

```python
from torchvision.models import resnet50, ResNet50_Weights

weights = ResNet50_Weights.IMAGENET1K_V2
model = resnet50(weights=weights)
```

Then replaced the final fully connected layer:

```python
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
```

Where `NUM_CLASSES = 38`.

Model was moved to GPU:

```python
model.to(device)
```

---

## **7. Loss Function and Optimizer**

We used:

### **Loss Function**

```python
criterion = nn.CrossEntropyLoss()
```

Perfect for multi-class classification.

### **Optimizer**

```python
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
```

* Adam works well for transfer learning
* Low learning rate prevents forgetting pretrained features

### **Learning Rate Scheduler**

(optional but recommended)

```python
scheduler = StepLR(optimizer, step_size=3, gamma=0.1)
```

---

## **8. Training Process (10 Epochs)**

Each epoch iterates through:

### **8.1 Forward Pass**

* Model predicts output logits
* Compare with labels using CrossEntropyLoss

### **8.2 Backpropagation**

```python
loss.backward()
optimizer.step()
optimizer.zero_grad()
```

### **8.3 Validation after every epoch**

* Computes validation accuracy & loss
* Tracks best performing model

---

## **9. Monitoring Training**

Colab displayed:

```
Epoch 1/10  
7%|▋ | 96/1358 [00:34<07:40, 2.74it/s]
```

Meaning:

* 96 batches processed out of 1358 total training batches
* Training running ~2.7 images/batch/sec

---

## **10. Saving the Model**

After each epoch:

* If validation accuracy improved → model saved to Google Drive.

```python
torch.save(model.state_dict(), "/content/drive/MyDrive/LeafGreen/best_model.pth")
```

This allows reuse in:

* Evaluation notebook
* Inference notebook
* Exporting to GitHub
* Deploying later

---

## **11. Final Output**

LeafGreen produces a trained ResNet-50 model that:

* Classifies **plant species**
* Identifies **disease type** (or healthy)
* Achieves high accuracy (typically >97%) on PlantVillage
* Ready for real-time inference with a simple image input function

---

## **12. How Model Will Be Used**

Later notebooks:

* `03_evaluation.ipynb` → confusion matrix, F1 score
* `04_inference.ipynb` → upload leaf image → predict class

This completes the full pipeline.
