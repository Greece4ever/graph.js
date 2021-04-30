import React, { useCallback, useEffect, useState } from 'react'
import {Graph2D} from 'graph2d.js'

import InputFunction from './components/function'
import { Resizable } from "re-resizable";

import Settings from './components/settings/settings'
import "./App.css"

import {createDefaultSettings, settings_prototype} from './components/settings/default_settings';





let settings = [
  {"name" : "Functions"   , "property": "function"       },
  {"name" : "Axes"        , "property": "axis"       },
  {"name":  "Grid"        , "property": "grid"     },
  {"name" : "Smaller Grid", "property": "outer_grid"             }
]


// const default_settings = createDefaultSettings(settings_prototype)


function App() {
  const [size, setSize] = useState([400, 400]);
  const [functions, setFunctions] = useState([ [x => NaN, "red"]  ]);
  const [selected, setSelected] = useState(null);
  const [length, setLength] = useState(0);

  const [layerWidth, setLayerWidth] = useState(0);

  const [currentSettings, setCurrentSettings] = useState( createDefaultSettings(settings_prototype) );

  const [unAppliedSettings, setUnApliedSettings] = useState(  createDefaultSettings(settings_prototype)   )


  
  useEffect(() => {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    setSize([width - layerWidth, height]);
  }, [])


  const handleResize = useCallback(() => {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    setSize([width - layerWidth, height]);
  })

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize])


  useEffect(() => {
    console.log("function length", functions.length);
    setLength(functions.length);
  }, [functions])

  const maxWidth = 400;

  return (
  <div className="App" style={{
    width: "100%",
    height: "100%",
    overflow: "hidden !important"
  }} >
      
    <Resizable

    onResize={ (e, dir, elm) => {
      let width = elm.getBoundingClientRect().width;
      setLayerWidth(width);
      setSize([window.innerWidth - width, window.innerHeight]);
    }}

    maxWidth={`${maxWidth}px`}
    minWidth={'200px'}

    maxHeight={'100vh'}
    minHeight={'100vh'}

    defaultSize={{width: 350, height:'100vh'}}

    
    style={{float : 'left', width: "20%", height: "100vh"}}>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
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
    </Resizable>



    <div style={{float: 'none', overflow: "hidden", background: "red" }}>
      <Graph2D canvasStyle={currentSettings} functions={functions} width={size[0]} height={size[1]} />

    </div>

    <Settings 
    
    setCurrentSettings={setCurrentSettings}
    currentSettings={currentSettings}

    unAppliedSettings={unAppliedSettings} setUnApliedSettings={setUnApliedSettings} settings={settings} settings_prototype={settings_prototype} />

    </div>
  )
}

export default App;