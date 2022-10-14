import { useEffect, useState } from 'react';
import Canvas from 'react-canvas-polygons';

import { useTopPageState } from '../../hoooks/useTopPageState';

const DrawCanvasSection = (ref) => {
  const { points, canvasClick, imageFile, imageSize } = useTopPageState();

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
    handleCleanCanva();
  }, [imageSize]);

  // not sure what this is
  useEffect(() => {
    const timeout = setTimeout(() => setTool('Polygon'), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <button onClick={handleCleanCanva}>Clean Canvas</button>
      {imageSize && imageFile ? (
        <Canvas
          ref={(canvas) => (ref = canvas)}
          imgSrc="https://images.globalindustrial.com/images/enlarge/695511.jpg?t=1628284125430"
          height={800}
          width={800}
          tool={tool}
          onDataUpdate={(data) => canvasClick(data)}
          onFinishDraw={(data) => {
            canvasClick(data);
            console.log('finish draw');
          }}
          initialData={points}
        />
      ) : (
        <Canvas
          ref={(canvas) => (ref = canvas)}
          // imgSrc={imageFile}
          // height={imageSize.height}
          // width={imageSize.width}
          imgSrc="https://images.globalindustrial.com/images/enlarge/695511.jpg?t=1628284125430"
          height={800}
          width={800}
          tool={tool}
          onDataUpdate={(data) => canvasClick(data)}
          onFinishDraw={(data) => {
            canvasClick(data);
            console.log('finish draw');
          }}
          initialData={points}
        />
      )}
    </div>
  );
};

export default DrawCanvasSection;
