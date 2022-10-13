import { useState } from 'react';
import DrawCanvasSection from './DrawCanvasSection';

const TopPage = () => {
    const [points, setPoint] = useState();
    const onChange = (data) => {
      setPoint(data);
      console.log(points);
    };

  return (
    <>
        <DrawCanvasSection initialData={points} onChange={onChange}/>
    </>
  );
};

export default TopPage;