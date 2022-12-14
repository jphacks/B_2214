from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import torch
from torch import nn
import torchvision.transforms as transforms
import torch.nn.functional as F
import numpy as np
from PIL import Image
import urllib
import sys
sys.path.append("./machine_learning")
from semantic_segmentation.utils.pspnet import PSPNet
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
import random
import string

cred = credentials.Certificate('./oyster-365512-firebase-adminsdk-722nb-debc2e59fa.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'oyster-365512.appspot.com'
})

bucket = storage.bucket()
def upload_blob(source_file, destination_blob_name):

    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file, content_type='image/png')
    blob.make_public()
    url = blob.public_url
    print(url)
    print(
        f"File {source_file} uploaded to {destination_blob_name}."
    )
    return url

app = Flask(__name__)
CORS(app)

# Load model
model = PSPNet(n_classes=2)
state_dict = torch.load("./machine_learning/semantic_segmentation/weights/pspnet50_2.pth", map_location={'cuda:0': 'cpu'})
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
    input_batch = input_tensor.unsqueeze(0).to(device) # create a mini-batch as expected by the model
    output = model(input_batch)

    y = output[0][0].detach().cpu().numpy()  # y???torch.Size([1, 21, 475, 475])
    y = np.argmax(y, axis=0)
    mask_img = Image.fromarray(np.uint8(y), mode='P')
    mask_img = mask_img.resize((input_image.size), Image.NEAREST)
    rgb_mask_img = mask_img.convert('RGBA')

    trans_img = Image.new('RGBA', rgb_mask_img.size, (0, 0, 0, 0))

    for x in range(rgb_mask_img.size[0]):
        for y in range(rgb_mask_img.size[1]):
            # ???????????????????????????????????????????????????
            pixel = rgb_mask_img.getpixel((x, y))
            r, g, b, a = pixel

            # (0, 0, 0)???????????????????????????????????????????????????
            if pixel[0] == 0 and pixel[1] == 0 and pixel[2] == 0:
                continue
            else:
                # ?????????????????????????????????????????????????????????????????????
                trans_img.putpixel((x, y), (255, 0, 0, 100))

    rbga_result = Image.alpha_composite(input_image.convert('RGBA'), trans_img).convert('RGB')
    rbga_result.save('test.png')
    randomstring = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=20))
    imageurl = upload_blob('test.png',"predictions/"+randomstring+".png")
    area = str(np.sum(mask_img))
    print(area)
    print(imageurl)

    prediction_result = {
            "area": area,
            "url": imageurl
        }

    return jsonify({
        "predictions": [prediction_result]
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
