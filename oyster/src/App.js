import './App.css';
import { useState } from "react";
import DrawCanvas from "./components/DrawCanvas";

function App() {
  const [points, setPoint] = useState();
  const [pixelArea, setPixelArea] = useState(0);
  var area = require('area-polygon')

  const onChange = (data) => {
    setPoint(data);
    console.log(points);
    // calculate area
    if(points&&Object.keys(points).length>1&&points[String(Object.keys(points)[1])].length>2){
      setPixelArea(area(points[String(Object.keys(points)[1])]))
      console.log(area(points[String(Object.keys(points)[1])]))
    }
  };

  return (
    <div className="App">
      <DrawCanvas initialData={points} onChange={onChange} />
      <p>{pixelArea}</p>
    </div>
  );
}

export default App;
