from flask import Flask, request, Response, jsonify
from flask_cors import CORS

import torch
from torch import nn
import torchvision.transforms as transforms
import torch.nn.functional as F
import numpy as np
from PIL import Image
import urllib
from utils.pspnet import PSPNet

app = Flask(__name__)
CORS(app)

# Load model
model = PSPNet(n_classes=2)
state_dict = torch.load("../machine_learning/semantic_segmentation/weights/pspnet50_2.pth", map_location={'cuda:0': 'cpu'})
model.load_state_dict(state_dict)
model.eval()
print("Loaded model")

# Check for GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)
model = model.to(device)

# Preprocessing and postprocessing
preprocess = transforms.Compose([
    transforms.Resize((475, 475)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Health check route
@app.route("/isalive")
def is_alive():
    print("/isalive request")
    status_code = Response(status=200)
    return status_code


# Predict route
@app.route("/predict", methods=["POST"])
def predict():
    print("/predict request")
    req_json = request.get_json()
    url = req_json["instances"][0]["image"]
    print(url)
    filename = "test.png"
    try: urllib.URLopener().retrieve(url, filename)
    except: urllib.request.urlretrieve(url, filename)
    input_image = Image.open(filename)
    input_tensor = preprocess(input_image)
    input_batch = input_tensor.unsqueeze(0) # create a mini-batch as expected by the model
    output = model(input_batch)

    y = output[0][0].detach().numpy()  # y：torch.Size([1, 21, 475, 475])
    y = np.argmax(y, axis=0)
    mask_img = Image.fromarray(np.uint8(y), mode='P')
    mask_img = mask_img.resize((input_image.size), Image.NEAREST)
    mask_img = np.array(anno_class_img)
    # Read the categories
    np_input_image = np.array(input_image)
    
    # 'np_input_image' is the masked img to be saved
    np_input_image[mask_img==1] = [255, 0, 0]

    area = np.sum(mask_img)

    return jsonify({
        "area": area
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)