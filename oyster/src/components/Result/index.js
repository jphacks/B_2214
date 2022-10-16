import Canvas from '@kazuyahirotsu/react-canvas-polygons';
import { useEffect, useState } from 'react';

import { useTopPageState } from '../../hooks/useTopPageState';

const Result = (ref) => {
  const { imageFile, imageSize, scale } = useTopPageState();
  const [tool, setTool] = useState('Polygon');
  const [lineLength, setLineLength] = useState();

  const handleCleanCanva = (e) => {
    e?.stopPropagation();
    ref.cleanCanvas();
    setTool('Polygon');
    const timeout = setTimeout(() => setTool('Line'), 50);
    return () => clearTimeout(timeout);
  };

  // need this after change of image
  useEffect(() => {
    imageSize&&handleCleanCanva();
  }, [imageSize]);

  // not sure what this is
  useEffect(() => {
    const timeout = setTimeout(() => setTool('Line'), 50);
    return () => clearTimeout(timeout);
  }, []);

  // get point data and calculate how many pixels are in the polygon
  const canvasClick = async (data) => {
    if(data.Line[0]){
      console.log(data.Line[0]);
      setLineLength(scale*Math.sqrt(Math.pow((data.Line[0][0][0]-data.Line[0][1][0]),2)+Math.pow((data.Line[0][0][1]-data.Line[0][1][1]),2)))
    }

  };

  return (
    <div>
      {imageSize&&
        <div>
            <Canvas
            ref={(canvas) => (ref = canvas)}
            imgSrc={imageFile}
            height={imageSize.height}
            width={imageSize.width}
            tool={tool}
            onDataUpdate={(data) => canvasClick(data)}
            onFinishDraw={(data) => {
              // canvasClick(data);
              console.log('finish draw');
            }}
          />
          <button onClick={handleCleanCanva}>Clean Canvas</button>
        </div>
      }
      <p>{lineLength}m</p>
    </div>
  );
};

export default Result;
