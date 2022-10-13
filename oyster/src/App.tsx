import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import DrawCanvas from "./DrawCanvas";

function App() {
  const [points, setPoint] = useState();

  const onChange = (data:any) => {
    setPoint(data);
    console.log(points);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <DrawCanvas initialData={points} onChange={onChange} />
    </div>
  );
}

export default App;
