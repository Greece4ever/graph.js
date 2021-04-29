import React, { useCallback, useEffect, useState } from 'react'
import {Graph2D} from 'graph2d.js'
import InputFunction from './components/function'

import "./App.css"

function App() {
  const [size, setSize] = useState([400, 400]);
  const [functions, setFunctions] = useState([]);
  
  useEffect(() => {
    const width  = Math.min(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const height = Math.min(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    setSize([(80/100) * width, height]); 
  }, [])

  const handleResize = useCallback(() => {
    setSize([window.innerWidth, window.innerHeight]);
  })

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [handleResize]);

  
  return (
  <div className="App">
    <div style={{float : 'left', width: "20%"}}>

    <div className="parent" style={{
      "width": "100%", height: window.innerHeight,
      // border: "1px solid green",
      background: "#181a1b",
      // borderRight: "1px solid #1e1f1f"
      border: "1px solid rgba(33, 32, 31, 0.1)"
      }}>

      <div style={{
        "width": "100%",
        "height": "48px",
        "background" : "#202224",
        border: "1px solid rgba(33, 32, 31, 0.1)",
        // "borderRight": "none"
      }}></div>



      <InputFunction />
        
    </div>    

    </div>

    <div style={{float: 'right', width: "80%"}}>
      <Graph2D functions={functions} width={size[0]} height={size[1]} />
    </div>

    </div>
  )
}

export default App;