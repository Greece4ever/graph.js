import React, { useEffect, useState } from 'react';
import Graph from './components/graph'
import {randomColor} from './components/math'

function random_alot() {
  let arr =[];
  for (let x=0 ;x < 50; x++)
  {
    arr.push([x, x * Math.random()])
  }
  return arr;
}


function App() {
  const [a, setA] = useState(2);
  const [functions, setFunctions] = useState([
    [(x) => 0.2*x**2 , "rgb(212, 116, 112)"],
    // [(x) => Math.sin(a*x) , "rgb(52, 152, 235)"],
  ])



  useEffect(() => {
    let interval = setInterval(() => {
      setA(prev => prev + 0.1);
    }, 50)

    return () => clearInterval(interval);
  })


  const [points, setPoints] = useState([
    [ random_alot(), { "circleBorder" : "auto", "circle" : "auto", "line" : "white" } ]
  ]);


  return (
    <div className="App">
      <Graph points={points} functions={functions} width={1024} height={768} />
      
    </div>
  );
}

export default App;
