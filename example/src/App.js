import React, { useCallback, useEffect, useState, createRef } from 'react'
import {Graph2D} from 'graph2d.js'
import InputFunction from './components/function'
import { Resizable } from "re-resizable";


import "./App.css"

function App() {
  const [size, setSize] = useState([400, 400]);
  const [functions, setFunctions] = useState([ [x => NaN, "red"]  ]);
  const [selected, setSelected] = useState(null);
  const [length, setLength] = useState(0);
  
  useEffect(() => {
    const width  = Math.min(document.documentElement.clientWidth || 0, window.innerWidth || 0)  
    const height = Math.min(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    console.log(window.innerHeight, window.outerHeight)
    setSize([(80/100) * width, height]); 
  }, [])

  useEffect(() => {
    console.log("function length", functions.length);
    setLength(functions.length);
  }, [functions])
  
  return (
  <div className="App" style={{
    width: "100%",
    height: "100%",
    overflow: "hidden !important"
  }} >
    {/* <div style={{float : 'left', width: "20%", height: "100vh", resize: "horizontal"}}>
      <div className="parent" style={{
        width: "100%", 
        height: "100%",
        background: "#181a1b",
        padding: "0 !important",
        margin:  "0 !important",
        border: "1px solid rgba(33, 32, 31, 0.1)",
  
        
        }}>

        <div style={{
          position: "relative",
          "width": "100%",
          "height": "48px",
          "background" : "#202224",
          border: "1px solid rgba(33, 32, 31, 0.1)",
          // "borderRight": "none"
        }}>

          <button onClick={() => {
            setFunctions(prev => [...prev, [ x => NaN, "red" ] ])
          }} 
          className="btn" style={{"position" : "absolute", left: 0, color: "#40648d"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
            </svg>
          </button>

          <button onClick={() => {
            console.log(selected);

            if (selected === null)
              return;
              

            setFunctions(prev => {
              let copy_prev = prev.slice();
              copy_prev.slice(selected, 1);
              return copy_prev;
            })
          }}
          
          style={{"position": "absolute", "right": 0, color: "#f15e53"}} className="btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>
          </button>

        </div>

        <div style={{width: "100%", height: "calc(100% - 48px)", overflow: "auto"}}
        >
          {functions.map( 
            (func, index) => <InputFunction setSelected={setSelected} length={length} functions={functions} setFunctions={setFunctions} index={index} />
          )}
        </div>

        
      </div>    
    </div> */}

    <Resizable 
      
      onResize={e => {
        console.log(e.screenX, e.screenY)
        setSize([window.innerWidth - e.screenX, window.innerHeight]);
      }}
      
      style={{'float': 'left', "background": "red"}} 
      defaultSize={{width: 200, height:'100%'}}>

    </Resizable>



    <div style={{float: 'none', overflow: "hidden" }}>
      <Graph2D canvasStyle={{
          function: {lineWidth: 3}
          
          } } functions={functions} width={size[0]} height={size[1]} />
    </div>

    </div>
  )
}

export default App;