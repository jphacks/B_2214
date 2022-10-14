import { useEffect, useState } from "react";

const Predict = ({imageUrl}) => {
    const [result, setResult] = useState();
    const API_KEY = process.env.REACT_APP_GCLOUD_ACCESS_TOKEN
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({instances: [{"image": imageUrl}]})
      };

    useEffect(() => {
        fetch('https://asia-northeast1-aiplatform.googleapis.com/v1/projects/oyster-365512/locations/asia-northeast1/endpoints/7480725271667015680:predict', requestOptions)
        .then((response) => response.json())
        .then((data) => {
        console.log('Success:', data);
        setResult(data)
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    },[])

    return (
        <div>
        <p>{result?.predictions}</p>
        </div>

    )

};

export default Predict;