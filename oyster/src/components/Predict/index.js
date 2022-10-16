import { useEffect, useState } from "react";

const Predict = ({imageUrl}) => {
    const [result, setResult] = useState();

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"instances": [{"image": imageUrl}]})
          };
        console.log(requestOptions);
        fetch('https://asia-northeast1-oyster-365512.cloudfunctions.net/madori-endpoint-api', requestOptions)
        .then((response) => response.json())
        .then((data) => {
        console.log('Success:', data);
        setResult(data)
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    },[imageUrl])

    return (
        <div>
        <p>{result?.prediction[0].area}</p>
        <img src={result?.prediction[0].url} />
        </div>
    )
};

export default Predict;
