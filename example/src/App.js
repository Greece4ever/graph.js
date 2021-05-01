import React, { useCallback, useEffect, useState } from 'react'
import {Graph2D} from 'graph2d.js'

import InputFunction from './components/function'
import { Resizable } from "re-resizable";

import Settings from './components/settings/settings'
import "./App.css"

import {createDefaultSettings, settings_prototype} from './components/settings/default_settings';


import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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

          <Button onClick={() => {
            setFunctions(prev => [...prev, [ x => NaN, "red" ] ])
          }} 
           style={{"position" : "absolute", left: 0, color: "#40648d", marginTop: "5px"}}>
            <AddIcon />
          </Button>

          {/* <Button

          onClick={() => {
            if (!selected)
              return;

            setFunctions(prev => {
              let f_copy = prev.map(i => i.slice());
              console.log( prev)
              f_copy.splice(selected, 1)
              console.log(f_copy)
              return f_copy;
            })
          }}
          
          style={{"position": "absolute", "right": 0, marginTop: "5px", color: "#f15e53"}} className="btn">
            < DeleteForeverIcon />
          </Button> */}

        </div>

        <div style={{width: "100%", height: "calc(100% - 48px)", overflow: "auto"}}
        >
          {functions.map( 
            (func, index) => <InputFunction selected={selected} setSelected={setSelected} length={length} functions={functions} setFunctions={setFunctions} index={index} />
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