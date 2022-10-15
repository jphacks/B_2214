from google.cloud import aiplatform

def endpoint_predict_sample(
    project: str, location: str, instances: list, endpoint: str
):
    aiplatform.init(project=project, location=location)

    endpoint = aiplatform.Endpoint(endpoint)

    prediction = endpoint.predict(instances=instances)
    print(prediction)
    return prediction

endpoint_predict_sample(
    project = 'oyster-365512', 
    endpoint = '7480725271667015680', 
    instances = [{"image": "https://github.com/pytorch/hub/raw/master/images/dog.jpg"}], 
    location = "asia-northeast1"
)