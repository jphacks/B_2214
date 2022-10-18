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
  const [annotationRef, setAnnotationRef] = useState();
  const [showResult, setShowResult] = useState(false);
  const [manual, setManual] = useState(false);
  const [controlPanelValue, setControlPanelValue] = useState('ai');
  const [predictionRequestUrl, setPredictionRequestUrl] = useState('');
  const [prediction, setPrediction] = useState();
  const [tool, setTool] = useState('Line');
  const [lineLength, setLineLength] = useState();
  // metrics selection
  const options = [
    { value: 'm2', text: 'm^2' },
    { value: 'jyo', text: '帖' },
  ];
  const [selectedMetric, setSelectedMetric] = useState(options[0].value);

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
        annotationRef,
        setAnnotationRef,
        showResult,
        setShowResult,
        manual,
        setManual,
        controlPanelValue,
        setControlPanelValue,
        predictionRequestUrl,
        setPredictionRequestUrl,
        prediction,
        setPrediction,
        tool,
        setTool,
        lineLength,
        setLineLength,
        // objects
        options,
      }}
    >
      {children}
    </topPageStateContext.Provider>
  );
};
