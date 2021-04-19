import React, { useState } from 'react';
import Plot2D from './components/graph'
import {randomColor} from './components/math'

function App() {
  const [functions, setFunctions] = useState([
    [(x) => x, "rgb(212, 116, 112)"],
    [(x) => -0.2*x**2 , "rgb(212, 20, 112)"],

  ])


  const [points, setPoints] = useState([
    // [ random_alot(), { "circleBorder" : "auto", "circle" : "auto", "line" : "white" } ]
  ]);


  return (
    <div className="App">
      <Plot2D 

      // htmlStyle={{"border" : "none"}}
      canvasStyle={{ 
        // crossSettings : {"strokeColor": "red"},
        // gridSettings  : {"strokeColor": "grey"},
        // outerGrid     : {"strokeColor": "grey"}
        // axis : {"strokeStyle": "white"}
        // text: {strokeStyle : "yellow", fillStyle : "white"}

       }}

      points={points} 
      functions={functions} 
      width={800} height={600} />
      
    </div>
  );
}

export default App;
