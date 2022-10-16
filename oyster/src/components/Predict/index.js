import { useEffect } from "react";

import { useTopPageState } from '../../hooks/useTopPageState';

const Predict = ({imageUrl}) => {
    const { setManual, predictionRequestUrl, setPredictionRequestUrl, prediction, setPrediction, setPixelArea } = useTopPageState();



    const onClick = () => {
        setManual(true);
        setPixelArea()
      };

    useEffect(() => {
        if(predictionRequestUrl!==imageUrl){
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
            setPrediction(data)
            })
            .catch((error) => {
            console.error('Error:', error);
            });
            setPredictionRequestUrl(imageUrl);
        }
    },[imageUrl])

    setPixelArea(prediction?.prediction[0].area)
    console.log(prediction?.prediction[0].area)

    return (
        <div>
        <button disabled>ai mode</button>
        <button onClick={onClick}>manual mode</button>
        <p>{prediction?
        <img src={prediction?.prediction[0].url} />:
        "fetching ai prediction..."}</p>
        </div>
    )
};

export default Predict;
