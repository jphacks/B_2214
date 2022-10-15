import { useEffect, useState } from 'react';
import Canvas from 'react-canvas-polygons';

import { useTopPageState } from '../../hooks/useTopPageState';
import Predict from '../Predict';

const DrawCanvasSection = (ref) => {
  const { points, imageFile, imageSize, setPoint, setPixelArea } = useTopPageState();

  const [tool, setTool] = useState('Line');
  const handleCleanCanva = (e) => {
    e?.stopPropagation();
    ref.cleanCanvas();
    setTool('Line');
    const timeout = setTimeout(() => setTool('Polygon'), 50);
    return () => clearTimeout(timeout);
  };

  // need this after change of image
  useEffect(() => {
    imageSize&&handleCleanCanva();
  }, [imageSize]);

  // not sure what this is
  useEffect(() => {
    const timeout = setTimeout(() => setTool('Polygon'), 50);
    return () => clearTimeout(timeout);
  }, []);

  // get point data and calculate how many pixels are in the polygon
  const area = require('area-polygon');
  const canvasClick = (data) => {
    setPoint(data);
    console.log(points);
    if (
      points &&
      Object.keys(points).length > 1 &&
      points[String(Object.keys(points)[1])].length > 2
    ) {
      setPixelArea(area(points[String(Object.keys(points)[1])]));
      console.log(area(points[String(Object.keys(points)[1])]));
    }
  };

  return (
    <div>
      {imageSize&&
        <div>
            <button onClick={handleCleanCanva}>Clean Canvas</button>
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
            initialData={points}
          />
        <Predict imageUrl={imageFile}/>
        </div>
      }
    </div>
  );
};

export default DrawCanvasSection;
