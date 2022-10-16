from google.cloud import aiplatform
from flask import jsonify
def predict(request):

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    data = request.get_json()

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
        instances = data['instances'], 
        location = "asia-northeast1"
    )

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return (jsonify({"prediction": prediction.predictions}), 200, headers)