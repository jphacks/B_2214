import { useEffect, useState } from "react";



const Predict = ({imageUrl}) => {
    // const [result, setResult] = useState();
    // const API_KEY = process.env.REACT_APP_GCLOUD_ACCESS_TOKEN
    // const requestOptions = {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': 'Bearer '+API_KEY,
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({instances: [{"image": imageUrl}]})
    //   };

    // useEffect(() => {
    //     fetch('https://asia-northeast1-aiplatform.googleapis.com/v1/projects/oyster-365512/locations/asia-northeast1/endpoints/7480725271667015680:predict', requestOptions)
    //     .then((response) => response.json())
    //     .then((data) => {
    //     console.log('Success:', data);
    //     setResult(data)
    //     })
    //     .catch((error) => {
    //     console.error('Error:', error);
    //     });
    // },[])

    // return (
    //     <div>
    //     <p>{result?.predictions}</p>
    //     </div>

    // )

    // // const endpointId = '7480725271667015680';
    // // const project = 'oyster-365512';
    // // const location = 'asia-northeast1';
    // // const aiplatform = require('@google-cloud/aiplatform');
    // // const {prediction} =
    // // aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

    // // // Imports the Google Cloud Prediction service client
    // // const {PredictionServiceClient} = aiplatform.v1;

    // // // Import the helper module for converting arbitrary protobuf.Value objects.
    // // const {helpers} = aiplatform;

    // // // Specifies the location of the api endpoint
    // // const clientOptions = {
    // // apiEndpoint: 'asia-northeast1-aiplatform.googleapis.com',
    // // };

    // // // Instantiates a client
    // // const predictionServiceClient = new PredictionServiceClient(clientOptions);

    // // async function predictTablesClassification() {
    // // // Configure the endpoint resource
    // // const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;
    // // const parameters = helpers.toValue({});

    // // const instance = helpers.toValue({"image": imageUrl});

    // // const instances = [instance];
    // // const request = {
    // //     endpoint,
    // //     instances,
    // //     parameters,
    // // };

    // // // Predict request
    // // const [response] = await predictionServiceClient.predict(request);

    // // console.log('Predict tabular classification response');
    // // console.log(`\tDeployed model id : ${response.deployedModelId}\n`);
    // // const predictions = response.predictions;
    // // console.log('Predictions :');
    // // console.log(response)
    //   for (const predictionResultVal of predictions) {
    //     const predictionResultObj =
    //       prediction.TabularClassificationPredictionResult.fromValue(
    //         predictionResultVal
    //       );
    //     for (const [i, class_] of predictionResultObj.classes.entries()) {
    //       console.log(`\tClass: ${class_}`);
    //       console.log(`\tScore: ${predictionResultObj.scores[i]}\n\n`);
    //     }
    //   }
    // //}
    // // useEffect(() => {
    // //     predictTablesClassification();
    // // },[])
};

export default Predict;