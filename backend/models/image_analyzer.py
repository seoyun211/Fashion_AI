from PIL import Image
from torchvision import transforms, models
import torch

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

model = models.resnet18(pretrained=True)
model.eval()

LABELS = ["상의", "하의", "주얼리", "신발", "기타"]

def analyze_image(path: str) -> str:
    image = Image.open(path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
        pred_index = torch.argmax(output, 1).item()

    return LABELS[pred_index % len(LABELS)]
