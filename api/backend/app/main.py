from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS

# from typing import Dict, List, Union
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value

app = Flask(__name__, static_folder="./build/static", template_folder="./build")
CORS(app)

@app.route("/isalive", methods=['GET'])
def isalive():
    return "alive"

@app.route("/predict", methods=['GET','POST'])
def predict():
    data = request.get_json()
    print(data['instances'][0]['image'])

    def endpoint_predict_sample(
        project: str, location: str, instances: list, endpoint: str
    ):
        aiplatform.init(project=project, location=location)

        endpoint = aiplatform.Endpoint(endpoint)

        prediction = endpoint.predict(instances=instances)
        print(prediction.predictions)
        return prediction

    prediction = endpoint_predict_sample(
        project = 'oyster-365512', 
        endpoint = '7480725271667015680', 
        # instances = [{"image": "https://github.com/pytorch/hub/raw/master/images/dog.jpg"}],
        instances = data['instances'], 
        location = "asia-northeast1"
    )
    return jsonify({
        "prediction": prediction.predictions
    })


if __name__ == "__main__":
    app.debug = True
    app.run(host='127.0.0.1', port=5000)