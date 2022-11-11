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
import os
import numpy as np
import tensorflow as tf
import cv2

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

# Load segmentation model
model = PSPNet(n_classes=2)
state_dict = torch.load("./machine_learning/semantic_segmentation/weights/pspnet50_1022_0221_100.pth", map_location={'cuda:0': 'cpu'})
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

# setup DeepFloorplan
os.environ['CUDA_VISIBLE_DEVICES'] = '0'

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

floorplan_map = {
	0: [255,255,255], # background
	1: [192,192,224], # closet
	2: [192,255,255], # batchroom/washroom
	3: [224,255,192], # livingroom/kitchen/dining room
	4: [255,224,128], # bedroom
	5: [255,160, 96], # hall
	6: [255,224,224], # balcony
	7: [255,255,255], # not used
	8: [255,255,255], # not used
	9: [255, 60,128], # door & window
	10:[  0,  0,  0]  # wall
}

def ind2rgb(ind_im, color_map=floorplan_map):
	rgb_im = np.zeros((ind_im.shape[0], ind_im.shape[1], 3))

	for i, rgb in color_map.items():
		rgb_im[(ind_im==i)] = rgb

	return rgb_im



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

    y = output[0][0].detach().cpu().numpy()  # y：torch.Size([1, 21, 475, 475])
    y = np.argmax(y, axis=0)
    mask_img = Image.fromarray(np.uint8(y), mode='P')
    mask_img = mask_img.resize((input_image.size), Image.NEAREST)
    rgb_mask_img = mask_img.convert('RGBA')

    trans_img = Image.new('RGBA', rgb_mask_img.size, (0, 0, 0, 0))

    for x in range(rgb_mask_img.size[0]):
        for y in range(rgb_mask_img.size[1]):
            # 推論結果画像のピクセルデータを取得
            pixel = rgb_mask_img.getpixel((x, y))
            r, g, b, a = pixel

            # (0, 0, 0)の背景ならそのままにして透過させる
            if pixel[0] == 0 and pixel[1] == 0 and pixel[2] == 0:
                continue
            else:
                # それ以外の色は用意した画像にピクセルを書き込む
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
# Predict route
@app.route("/predict2", methods=["POST"])
def predict2():
    print("/predict request")
    req_json = request.get_json()
    url = req_json["instances"][0]["image"]
    print(url)
    filename = "test.png"
    try: urllib.URLopener().retrieve(url, filename)
    except: urllib.request.urlretrieve(url, filename)
    im = cv2.imread(filename)
    im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
    im = im.astype(np.float32)
    im = cv2.resize(im, dsize=(512,512)) / 255.
    # create tensorflow session
    with tf.compat.v1.Session() as sess:
        # initialize
        sess.run(tf.group(tf.compat.v1.global_variables_initializer(),
                    tf.compat.v1.local_variables_initializer()))

        # restore pretrained model
        saver = tf.compat.v1.train.import_meta_graph('./machine_learning/DeepFloorplan/pretrained/pretrained_r3d.meta')
        saver.restore(sess, './machine_learning/DeepFloorplan/pretrained/pretrained_r3d')

        # get default graph
        graph = tf.compat.v1.get_default_graph()

        # restore inputs & outpus tensor
        x = graph.get_tensor_by_name('inputs:0')
        room_type_logit = graph.get_tensor_by_name('Cast:0')
        room_boundary_logit = graph.get_tensor_by_name('Cast_1:0')

        # infer results
        [room_type, room_boundary] = sess.run([room_type_logit, room_boundary_logit],\
                                        feed_dict={x:im.reshape(1,512,512,3)})
        room_type, room_boundary = np.squeeze(room_type), np.squeeze(room_boundary)

        # merge results
        floorplan = room_type.copy()
        floorplan[room_boundary==1] = 9
        floorplan[room_boundary==2] = 10
        floorplan_rgb = ind2rgb(floorplan)
    result_img = np.where(np.all(floorplan_rgb == [0, 0, 0], axis=-1), 0, 255)
    cv2.imwrite('test2.png', result_img)
    randomstring = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=20))
    imageurl = upload_blob('test2.png',"predictions2/"+randomstring+".png")
    print(imageurl)

    prediction_result = {
            "url": imageurl
        }

    return jsonify({
        "predictions": [prediction_result]
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
