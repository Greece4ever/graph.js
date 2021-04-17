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
  const [functions, setFunctions] = useState([
    [(x) => 0.2*x**2 , "rgb(212, 116, 112)"],
  ])

  useEffect(() => {
    let data = [];
    for (let i=1; i < 2; i++)
    {
      data.push( [(x) => Math.sin(x), randomColor() ] )
    }
    setFunctions(prev => data)
  }, [])

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
