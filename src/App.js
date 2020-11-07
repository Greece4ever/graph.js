import { useRef, useState, useEffect } from 'react';
import InputFunction from "./comps";
import katex from 'katex';
import './katex.css';

export function print(...args) {
  return console.log(...args);
}

function r_color(){
  let arr = [];
  for(let i=0;i<3;i++){
    arr.push(Math.random()*255);
  }
  return `rgb(${arr.join(",")})`
}

const f = (x) => {
  return Math.cos(2*x)
}

function App() {
  const canvas = useRef();
  const [zoom,setZoom] = useState(40);
  const [ctx,setCtx] = useState();
  const [dim,setDim] = useState([1920,1080]);
  const [mDown,setMDown] = useState(false);
  const [q,setQ] = useState(0);
  const [textShift,setTextShift] = useState(-0.4);
  const [numShift,setNumShift] = useState(1);
  const [point,setPoint] = useState(0,0);
  const [buffer,setBuffer] = useState('');
  const [repr,setReprp] = useState(0);
  const [inps,setInps] = useState([{'color' : "red"},{color : "orange"},{color : "blue"}]);
  const [func,setFunc] = useState(() => f);
  let area = <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-triangle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg>
  let slope = <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-down-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/></svg>
  let dot = <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dot" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>



  const toPixels = (x,y) => {
    return [dim[0]/2+(x*zoom),dim[1]/2+(-y*zoom)]
  }
  
  const toCartesian = (w,h) => {
    return [
      ( w - (dim[0]/2) ) / zoom,
      -(h - (dim[1]/2)) / zoom
    ]
  }

  function clearCanvas(canvas) {
    ctx.save();
    ctx.globalCompositeOperation = 'copy';
    ctx.strokeStyle = 'transparent';
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.restore();
  }

  function arrow(x1,y1,x2,y2){
    let a = (y2-y1) / (x2-x1);
    ctx.beginPath();
    ctx.lineWidth  = "2"
    ctx.strokeStyle = "yellow";
    let [sa,ca] = [Math.sin(a),Math.cos(a)] 
    let x0 = x1 - 70 * ca;
    let y0 = y1 - 70 * sa;
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.lineTo(x2,y2);
    let x3 = x2 + 70 * ca
    let y3 = y2 + 70 * sa;
    ctx.lineTo(x3,y3); 
    ctx.stroke();
    ctx.beginPath()
    ctx.fillStyle = "white";
    ctx.arc(x2,y2,3,0,360);
    ctx.arc(x1,y1,3,0,360);
    ctx.fill();
    ctx.font = "10px KaTeX_Main"
    ctx.fillText(`a = ${a.toFixed(2)}`,x2,y2-30);
    
  }
  
  function dotpoint() {
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle = "yellow"
    let y = func(point[0]);
    ctx.arc(...toPixels(point[0],y),3,0,360)
    ctx.fill();  
    ctx.font = "10px KaTeX_Main";
    ctx.fillStyle = "white"
    ctx.fillText(`y = ${y.toFixed(3)}`,...toPixels(point[0],y+.4));

  }
  
  function render(){
    ctx.strokeStyle = ctx.fillStyle ="black"
    clearCanvas();
    ctx.restore();
    ctx.beginPath();
    plot(func,-1000,1000,10);
    DrawCross(ctx, toPixels);
    DrawNums(ctx, toPixels);
    switch(repr) {
      case 2:
        arrow(...toPixels(point[0],func(point[0])),
        ...toPixels(point[0]+2,func(point[0]+2)))
        break;
      case 0:
        dotpoint();
        break;
      default:
        break;
    }

  }

  useEffect(() => {
    if(!canvas.current) return;
    let cvs = canvas.current;
    setCtx(cvs.getContext('2d'));
  },[canvas])

  useEffect(() => {
    if(!ctx) return;
    render();
  },[ctx,zoom,mDown,q,point])


  const DrawCross = (ctx) => {
    // Up
    ctx.beginPath()
    ctx.strokeStyle = "grey";
    ctx.lineCap = "round";


    ctx.moveTo(...toPixels(0,0));
    ctx.lineTo(...toPixels(0,100))

    // Down 
    ctx.moveTo(...toPixels(0,0));
    ctx.lineTo(...toPixels(0,-100))

    // Right 
    ctx.moveTo(...toPixels(0,0));
    ctx.lineTo(...toPixels(100,0))


    // Left 
    ctx.moveTo(...toPixels(0,0));
    ctx.lineTo(...toPixels(-100,0))
    
    ctx.stroke()
    ctx.closePath()
    
  }

  const HandleZoom = (e) => {
    const can = canvas.current;
    let [nX,nY] = [e.pageX-can.offsetLeft,e.pageY - can.offsetTop];
    if(e.deltaY > 0) {
      setZoom(prev => prev - 2);
    } else {
      ctx.scale(1,1);
      setZoom(prev => prev + 2)
    }
    // ctx.translate(nX - mDown.x,nY-mDown.y);
    return () => setMDown({'x' : nX,'y' : nY});
} 

  const DrawNums = (ctx, toPixels) => {
    ctx.beginPath()
    ctx.strokeStyle = ctx.fillStyle =  "white"
    ctx.lineCap = "round";
    ctx.font  = "10px Arial"
    ctx.moveTo(...toPixels(0,0));
    for(let i=-20;i <= 20;i+=numShift) {
      if(i==0) continue;
      ctx.fillText(`${i.toFixed(2)}`,...toPixels(i,0+textShift));
    }

    ctx.moveTo(...toPixels(0,0));
    for(let i=-20;i <= 20;i+=numShift) {
      ctx.fillText(`${i.toFixed(2)}`,...toPixels(0+textShift,i));
    }
}

  const plot = (f,start=-100,end=100,div=10) => {
    ctx.beginPath()
    ctx.lineCap = "round";
    ctx.lineWidth = "2"
    ctx.strokeStyle = "red"
    for(let i=start;i<end;i++){
      ctx.lineTo(
        ...toPixels(i/div,f(i/div))
      )
    }
    ctx.stroke()
    ctx.lineWidth = "1"
    ctx.closePath()
  }

  useEffect(() => {
    if(!point) return;
    katex.render(`(${point[0].toFixed(2)},${point[1].toFixed(2)})`, document.getElementById("points"), {
      throwOnError: false
  });

  },[point])

  return (
    <div className="App">
      <div style={{"position" : "fixed",left : 10,top : 5}}>
        <span id={"points"} 
        style={{"fontWeight" : "#81807e",color : "grey",
        pointerEvents : "none",userSelect : "none",fontSize : "17px"}}>
        </span>
      </div>
      <canvas tabIndex={0}
      onWheel={(e) => {
        if(zoom<=2) {
          return setZoom(prev => prev + 1)
        }
        HandleZoom(e);
        const can = canvas.current;
        let [nX,nY] = [e.pageX-can.offsetLeft,e.pageY - can.offsetTop];
        ctx.translate(nX - mDown.x,nY-mDown.y);
        switch(true){
          case zoom >= 40:
            setNumShift(1);
            break;
            case zoom <= 20:
            setNumShift(10);
            break;
          default:
            setNumShift(5);
        }
      }}  
      onKeyDown={(e) => {
        if(e.key.toLowerCase() === 'd') {
          return setZoom(prev => prev  - 40);
        } else if(e.key.toLowerCase() === 'a'){
          return setZoom(prev => prev + 40);
        }
      }}
      onMouseDown={(e) => {
        setMDown({
          x : e.pageX,
          y : e.pageY
        });
      }}


      onMouseMove={(e) => {
        if(!ctx) return;
        let delta = e.target.getBoundingClientRect();
        let [x,y] = [e.clientX-delta.x,e.clientY-delta.y]
        let delta2 = ctx.getTransform()
        let cords = toCartesian(x-delta2.e,y-delta2.f)
        setPoint(cords)
        if(!mDown) return;
        const can = canvas.current;
        let [nX,nY] = [e.pageX-can.offsetLeft,e.pageY - can.offsetTop];
        ctx.translate(nX - mDown.x,nY-mDown.y);
        return setMDown({'x' : nX, 'y' : nY })
      }}

      onMouseUp={() => setMDown(false)}
      style={{"background" : "#121212",outline : "none"}}
      ref={canvas} width={dim[0]} height={dim[1]} >
      </canvas>
      <div style={{"position" : "fixed","width" : "100%",height : "30%",
      backgroundColor : "#434343",bottom : 0,opacity : .7,
      overflow : "scroll",
      overflowX : "hidden",
      left : 0,resize : "both"}} alias={"menu"}>
        <div style={{"position" : "relative",left : 0,top :0}}>
          <div style={{position : "relative","display" : "flex",
           "justify-content" : "space-around",height  : "50px",
           backgroundColor : "#ba2b2b",
           textAlign : "center",width  : "100%"}}>
            <div onClick={() => setReprp(0)} className="btn">{dot}</div>
            <div onClick={() => setReprp(1)} className="btn">{area}</div>
            <div onClick={() => setReprp(2)} className="btn">{slope}</div>
          </div>
          <div style={{position : "relative","display" : "flex",
           "justify-content" : "space-around",height  : "50px",
           textAlign : "center",width  : "100%"}}>
            <div className="inps">
              {inps.map(i => {
                <InputFunction setBuffer={setBuffer}></InputFunction>
              })}
            </div>
            <div className="inps">Hello</div>
            <div className="inps">Wolrd</div>
          </div>
        </div>
        <div style={{display: "grid",overflow : "auto"}}>
        </div>
      </div>
    </div>
  );
}

export default App;
