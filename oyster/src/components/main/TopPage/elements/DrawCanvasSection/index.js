import { useEffect, useState } from 'react';
import Canvas from 'react-canvas-polygons';

import { useTopPageState } from '../../hoooks/useTopPageState';

const DrawCanvasSection = () => {
  const { imageFile, imageSize, initialData, onChange } = useTopPageState();

  const [tool, setTool] = useState('Line');
  const handleCleanCanva = (e) => {
    e?.stopPropagation();
    // ref.cleanCanvas();
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
      <Canvas
        // ref={(canvas) => (ref = canvas)}
        imgSrc={imageFile}
        height={imageSize.height}
        width={imageSize.width}
        tool={tool}
        onDataUpdate={(data) => onChange(data)}
        onFinishDraw={(data) => {
          onChange(data);
          console.log('finish draw');
        }}
        initialData={initialData}
      />
    </div>
  );
};

export default DrawCanvasSection;
