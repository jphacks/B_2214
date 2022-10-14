import { useEffect, useState } from 'react';
import DrawCanvasSection from './DrawCanvasSection';

const TopPage = () => {
    const [points, setPoint] = useState();
    const onChange = (data) => {
      setPoint(data);
      console.log(points);
    };

    useEffect(() => {
      fetch('http://localhost:8080/isalive', {method: 'GET'})
      .then(res => {
          console.log(res)
      })

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"image": "https://github.com/pytorch/hub/raw/master/images/dog.jpg"})
      };
      fetch('http://localhost:8080/predict', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },[])


  return (
    <>
        <DrawCanvasSection initialData={points} onChange={onChange}/>
    </>
  );
};

export default TopPage;