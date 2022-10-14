import { createContext, useState, useCallback } from 'react';

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
  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedMetric(event.target.value);
  };

  // get point data and calculate how many pixels are in the polygon
  const onChange = (data) => {
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

  // calculate scale
  const onClickCalc = () => {
    if (selectedMetric === 'm2') {
      setScale(inputArea / pixelArea);
      console.log(inputArea / pixelArea);
    } else {
      setScale((1.62 * inputArea) / pixelArea);
      console.log((1.62 * inputArea) / pixelArea);
    }
  };

  // drag and drop
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const img = new Image();
      console.log(URL.createObjectURL(file));
      setImageFile(URL.createObjectURL(file));
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImageSize({
          height: img.height,
          width: img.width,
        });
        console.log(img.height);
        console.log(img.width);
      };
    });
  }, []);

  return (
    <topPageStateContext.Provider
      value={{
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
        options,
        selectedMetric,
        setSelectedMetric,
        handleChange,
        onChange,
        onClickCalc,
        onDrop,
      }}
    >
      {children}
    </topPageStateContext.Provider>
  );
};
