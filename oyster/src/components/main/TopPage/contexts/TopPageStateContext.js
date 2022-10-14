import { createContext, useState } from 'react';

export const topPageStateContext = createContext(undefined);

export const TopPageStateProvider = (props) => {
  const { children } = props;

  const [points, setPoint] = useState();
  const [pixelArea, setPixelArea] = useState(0);
  const [inputArea, setInputArea] = useState('');
  const [scale, setScale] = useState(0);
  const [imageFile, setImageFile] = useState();
  const [imageSize, setImageSize] = useState();
  const area = require('area-polygon');

  // metrics selection
  const options = [
    { value: 'm2', text: 'm^2' },
    { value: 'jyo', text: '帖' },
  ];
  const [selectedMetric, setSelectedMetric] = useState(options[0].value);

  // get point data and calculate how many pixels are in the polygon
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
    <topPageStateContext.Provider
      value={{
        // state
        points,
        setPoint,
        pixelArea,
        setPixelArea,
        inputArea,
        setInputArea,
        scale,
        setScale,
        imageFile,
        setImageFile,
        imageSize,
        setImageSize,
        selectedMetric,
        setSelectedMetric,
        // objects
        options,
        // func
        canvasClick,
      }}
    >
      {children}
    </topPageStateContext.Provider>
  );
};
