import './App.css';
import { useState } from "react";
import DrawCanvas from "./components/DrawCanvas";

function App() {
  const [points, setPoint] = useState();

  const onChange = (data) => {
    setPoint(data);
    console.log(points);
  };

  return (
    <div className="App">
      <DrawCanvas initialData={points} onChange={onChange} />
    </div>
  );
}

export default App;
