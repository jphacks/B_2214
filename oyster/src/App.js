import './App.css';
import { useState } from "react";
import DrawCanvas from "./components/DrawCanvas";
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function App() {
  const [points, setPoint] = useState();
  const [pixelArea, setPixelArea] = useState(0);
  const [inputArea, setInputArea] = useState(0);
  const [scale, setScale] = useState(0);
  const img = new Image();
  const [imageFile, setImageFile] = useState();
  const [imageSize, setImageSize] = useState();
  var area = require('area-polygon')

  // metrics selection
  const options = [
    {value: 'm2', text: 'm^2'},
    {value: 'jyo', text: '帖'},
  ];
  const [selectedMetric, setSelectedMetric] = useState(options[0].value);
  const handleChange = event => {
    console.log(event.target.value);
    setSelectedMetric(event.target.value);
  };

  // get point data and calculate how many pixels are in the polygon
  const onChange = (data) => {
    setPoint(data);
    console.log(points);
    if(points&&Object.keys(points).length>1&&points[String(Object.keys(points)[1])].length>2){
      setPixelArea(area(points[String(Object.keys(points)[1])]));
      console.log(area(points[String(Object.keys(points)[1])]));
    }
  };

  // calculate scale
  const onClickCalc = () => {
    if(selectedMetric==='m2'){
      setScale(inputArea/pixelArea);
      console.log(inputArea/pixelArea);
    }else{
      setScale((1.62*inputArea)/pixelArea);
      console.log((1.62*inputArea)/pixelArea);
    }

  }

  // drag and drop
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      console.log(URL.createObjectURL(file))
      setImageFile(URL.createObjectURL(file))
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        setImageSize({
          height: img.height,
          width: img.width
        });
        console.log(img.height);
        console.log(img.width);
      };
    })
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="App">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <img src={imageFile} />

      <DrawCanvas initialData={points} onChange={onChange} />
      <p>{pixelArea} pixels</p>


      <input
        value={inputArea}
        onChange={(event) => setInputArea(event.target.value)}
      />
      <select value={selectedMetric} onChange={handleChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <button onClick={onClickCalc}>calc</button>


      <p>{scale} {selectedMetric} / pixel</p>
    </div>
  );
}

export default App;
