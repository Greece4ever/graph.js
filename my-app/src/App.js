import React, { useState } from 'react';
import Graph from './components/graph'

function random_alot() {
  let arr =[];
  for (let x=0 ;x < 50; x++)
  {
    arr.push([x, x * Math.random()])
  }
  return arr;
}

function App() {
  const [functions, setFunctions] = useState([
    [(x) => Math.sin(x), "rgb(212, 116, 112)"],
  ])

  const [points, setPoints] = useState([
    [ random_alot(), { "circleBorder" : "auto", "circle" : "auto", "line" : "white" } ]
  ]);

  return (
    <div className="App">
      <Graph points={points} functions={functions} width={800} height={600} />
      
    </div>
  );
}

export default App;
