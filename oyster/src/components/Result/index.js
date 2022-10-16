import Canvas from '@kazuyahirotsu/react-canvas-polygons';
import { useEffect, useState } from 'react';

import { useTopPageState } from '../../hooks/useTopPageState';

const Result = (ref) => {
  const { imageFile, imageSize } = useTopPageState();
  const [tool, setTool] = useState('Polygon')

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
    console.log(data)
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
              canvasClick(data);
              console.log('finish draw');
            }}
          />
          <button onClick={handleCleanCanva}>Clean Canvas</button>
        </div>
      }
    </div>
  );
};

export default Result;
