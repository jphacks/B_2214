import { useEffect, useState } from "react";

const Predict = ({imageUrl}) => {
    const [result, setResult] = useState();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({instances: [{"image": imageUrl}]})
      };

    useEffect(() => {
        fetch('https://asia-northeast1-oyster-365512.cloudfunctions.net/test-resnet18-endpoint-api', requestOptions)
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
        <p>{result?.prediction}</p>
        </div>
    )
};

export default Predict;