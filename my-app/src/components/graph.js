import React, { useEffect, useRef, useState } from 'react';
import {Vector, settings, getMousePos } from './math'

const Graph = (props) => {
    const canvas = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [offset, setOffset] = useState( new Vector(0, 0) );
    const [center, setCenter] = useState( new Vector(0, 0) );
    const [size, setSize] = useState( new Vector(0, 0) );
    const [zoom, setZoom] = useState( 40 );
    
    const [mouseDown, setMouseDown] = useState(null); // mouse down navigate through space
    const [mouseDownFunction, setMouseDownFunction] = useState(null); // mouse down get function (x, y)
    const [mouseDownPoint, setMouseDownPoint] = useState(null);

    const [increment, setIncrement] = useState(2);
    const [pixelUnitSize, setPixelUnitSize] = useState(100);
    const [add, setAdd] = useState(0);
    const [mpos, setMpos] = useState(new Vector(0, 0));
    

    const applyContextSettings = (settings) => {  for (let setting in settings)  {  ctx[setting] = settings[setting]; }  }
    const clear = () => ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    const toPixelsX = x => center.x + x * zoom;
        const toCartesianX = pX => (pX - center.x) / zoom
    const toPixelsY = y => center.y - y * zoom;    
        const toCartesianY = pY => -(pY - center.y) / zoom

    const toPixels = (x, y) => new Vector( toPixelsX(x), toPixelsY(y) );

    useEffect(() => setCtx(canvas.current.getContext("2d")), [canvas])
    useEffect(() => setSize(new Vector(canvas.current.width, canvas.current.height)), [ctx])
    useEffect(() => setCenter(new Vector(size.x / 2 + offset.x, size.y / 2 + offset.y)), [size, offset, zoom]);
    
    // get cartesian at start and end of screen
    // const getBoundsX = () => [ Math.floor( toCartesianX( 0 ) ),  Math.ceil(  toCartesianX( size.x ) )  ]; 
    // const getBoundsY = () => [ Math.floor( toCartesianY( 0 ) ),  Math.ceil(  toCartesianY( size.y ) )  ]; 
    const getBoundsX = () => [  toCartesianX( 0 ) ,  toCartesianX( size.x )  ]; 
    const getBoundsY = () => [  toCartesianY( 0 ) ,  toCartesianY( size.y )  ]; 

    useEffect(() => {
        if (mouseDownPoint)
        {

            let [x, y] = [toCartesianX(mpos.x), toCartesianY(mpos.y)]

            let func = props.functions[0];

            setMouseDownFunction(func);
            setMouseDownPoint(  new Vector(mpos.x, toPixelsY( func[0](x) )) )
        }
    }, [props.functions])

    useEffect(() => {
        if (!ctx)
            return;

        clear();    
        
        let [x_bounds, y_bounds] = 
        drawGrid();
        drawCrosses();
        drawFunction(x_bounds);
        // drawPoints();
        drawPointForFunction();
        drawText(x_bounds, y_bounds);    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx, center, increment, add, mouseDownPoint, mouseDownFunction, props.functions])


    // how to find the numbers in a sequence before and after a number

    // 0,    2,   4,   6, 8
    // 0.3  0.6  0.9
    // f(x) = a0 + k*x
    // k*x = 57 =>
    // 57

    const next = (num) => {
        let previous_term = Math.floor(num / increment);
        return (previous_term + 1) * increment
    }

    const prev = (num) => {
        let next_term = Math.floor(num / increment);
        return next_term * increment        
    }

    const drawText = (x_cords, y_cords) => {
        let font_size = Number(ctx.font.split(" ")[0].split("px")[0] );

        ctx.beginPath();
        applyContextSettings(settings.text);

            let posX = toPixelsY(0) + font_size;
        
            for (let x=x_cords.start; x <= x_cords.end; x += increment)
            {
                let x_level = toPixelsX(x);
                let x_str =  `${x.toFixed(1)}`
                if (x_str == 0)
                    continue;
                ctx.strokeText(x_str, x_level, posX );
                ctx.fillText(  x_str, x_level,   posX );

            }

            
            for (let y=y_cords.start; y >= y_cords.end; y -= increment)
            {

                let y_level = toPixelsY(y);
                let y_str = `${y.toFixed(1)}`; 
                if (y_str == 0)
                    continue;
                ctx.strokeText(y_str, toPixelsX(0) - font_size, y_level );
                ctx.fillText(  y_str, toPixelsX(0) - font_size, y_level );
            }

            ctx.stroke();
            ctx.fill();
        ctx.closePath();    



    }


    const drawGrid = () => {
        ctx.beginPath();
            applyContextSettings( props.crossSettings ?? settings.grid);
            let boundsX = getBoundsX();
            let boundsY = getBoundsY();


            let _x = {"start" : prev(boundsX[0]), "end" :  next(boundsX[1]) } 
            let _y = {"start" : prev(boundsY[0]), "end" :  prev(boundsY[1]) } 

            for (let x= _x.start; x <= _x.end; x += increment )
            {
                let x_level = toPixelsX(x);
                ctx.moveTo(x_level, 0);
                ctx.lineTo(x_level, size.y);                    
            }

            
            for (let y=_y.start; y >= _y.end; y -= increment )
            {
                let y_level = toPixelsY(y);
                ctx.moveTo(0, y_level);
                ctx.lineTo(size.x, y_level);            
            }
            ctx.stroke();
        ctx.closePath();

        return [_x, _y];
    }


    const drawFunction = (x_cords) => {
        applyContextSettings(settings.function)
        let inc = Math.abs(toCartesianX(size.x) - toCartesianX(0)) / 1000;
        props.functions.forEach(_ => {
            let f  = _[0];
            let color = _[1];
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(toPixelsX(x_cords.start), toPixelsY(f(x_cords.start)))
                for (let x=x_cords.start; x < x_cords.end; x += inc)
                {
                    let [x_, y_] = [toPixelsX(x), toPixelsY( f(x) )]
                    ctx.lineTo(x_, y_ )
                }

        
            ctx.stroke();
            ctx.closePath();    
        })
    }


    const drawPoints = () => {
        props.points.forEach(_ => {
            let cart_points = [];
            let points   = _[0];
            let settings = _[1];
            ctx.strokeStyle = "rgba(50, 90, 10, 0.9)";
            ctx.beginPath();
                
                let [x, y] = points[0];
                [x, y] = [toPixelsX(x), toPixelsY(y)]
                ctx.moveTo( x, y)

                cart_points.push([x, y]);
        
                points.forEach((point) => {
                    [x, y] = point;
                    [x, y] = [toPixelsX(x), toPixelsY(y)]
                    ctx.lineTo(x, y);
                    cart_points.push([x, y]);                    
                })
            
            ctx.stroke();
            ctx.closePath();                

            ctx.beginPath();
            // ctx.strokeStyle = "red"
                [x, y] = cart_points[0];
                ctx.moveTo( x, y)
                let r = (toPixelsX(2) - toPixelsX(1)) * 0.2;

        
                cart_points.forEach((point) => {
                    [x, y] = point;
                    ctx.moveTo(x + r, y);
                    ctx.arc(x, y, r, 0, 360);
                })
            
                ctx.fill();
                ctx.stroke();
            ctx.closePath();                
        })
    }



    const drawCrosses = () =>
    {
        ctx.beginPath();
            applyContextSettings( props.axis_settings ?? settings.axis);       
                ctx.moveTo( center.x, 0 );
                ctx.lineTo( center.x, size.y );
                
                ctx.moveTo( 0,  center.y);
                ctx.lineTo( size.x, center.y );        
            ctx.stroke();
        ctx.closePath();
    }

    const drawPointForFunction = () => {
        if (!mouseDownPoint)
            return;

        let font_size = Number(ctx.font.split(" ")[0].split("px")[0] );

        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = "grey"
            ctx.moveTo(mouseDownPoint.x, center.y);
            ctx.lineTo(mouseDownPoint.x, mouseDownPoint.y);

            ctx.moveTo(center.x, mouseDownPoint.y);
            ctx.lineTo(mouseDownPoint.x, mouseDownPoint.y);
            



            
            //                 ctx.fillText(  x_str, x_level,   posX );
            ctx.stroke();
            ctx.fill();

        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "black"
        ctx.fillStyle = "white"

        let x = toCartesianX(mouseDownPoint.x);
        let y = toCartesianX(mouseDownPoint.y);

        let text = `(${x.toFixed(2)}, ${y.toFixed(2)})`


        ctx.strokeText(text, mouseDownPoint.x + font_size, mouseDownPoint.y + font_size);
        ctx.fillText(text, mouseDownPoint.x + font_size, mouseDownPoint.y + font_size);

        ctx.closePath();

        ctx.beginPath();
        ctx.setLineDash([]);
        let r = (toPixelsX(2) - toPixelsX(1)) * 0.2;

            ctx.strokeStyle = mouseDownFunction[1];
            ctx.fillStyle = "white";
                ctx.arc( mouseDownPoint.x, mouseDownPoint.y, 5, 0, 360);
        ctx.stroke();
        ctx.fill();        
        ctx.closePath();


        ctx.beginPath();
        ctx.fillStyle = "rgba(230, 237, 26, 0.2)"
        let inc = Math.abs(toCartesianX(size.x) - toCartesianX(0)) / 1000;
        ctx.moveTo(toPixels(0), mouseDownPoint.y);

        let end = toCartesianX(mouseDownPoint.x);

        let cond = end >= 0 ? (x, mouse_point) => {return x < mouse_point} : (x, mouse_point) => {return x > mouse_point};
        inc = end >= 0 ? inc : -1 * inc;

        // console.log(cond(0, ) )
        
        for (x=0; cond(x, end); x += inc)
        {
            ctx.lineTo( toPixelsX(x), toPixelsY(mouseDownFunction[0](x)) )
        }
        

        ctx.lineTo( toPixelsX(x), toPixelsY(0) )
        ctx.lineTo( toPixelsX(0), toPixelsY(0) )


        ctx.fill();
        // ctx.stroke();
        ctx.closePath();

    }

    const handleMouseMove = (e) => {
        let pos2 = getMousePos(e);
        setMpos(pos2);
        
        if (mouseDownFunction)
        {
            let pos = getMousePos(e);

            let x = toCartesianX(pos.x);
            let y = mouseDownFunction[0](x);
            let pixel_y = toPixelsY(y);
            
            setMouseDownPoint( new Vector(pos.x, pixel_y) )
            return;
        }

        if (!mouseDown)
            return;
        
        let pos = getMousePos(e);
        
        setOffset(new Vector(
            mouseDown.offset.x - (mouseDown.mpos.x - pos.x),
            mouseDown.offset.y - (mouseDown.mpos.y - pos.y),
        ));
    }


    const handleWheel = (e) => {
        if (e.deltaY < 0)
        {
            setZoom(prev => prev + 1);
        }
        else {
            setZoom(prev => {
                let res = prev - 1;
                return res <= 0 ? 1 : res;
            });
        }

            let unit = Math.abs(toPixelsX(increment)- toPixelsX(0));
            if (unit <= 58 || unit >= 120)
            {
                let unit_dist = Math.abs(toPixelsX(2) - toPixelsX(1));
                setIncrement(pixelUnitSize / unit_dist );
            }


    }

    const handleClick = (e) => {
        e.preventDefault();
        let pos = getMousePos(e);
        props.functions.forEach(func => {
            let [x, y] = [toCartesianX(pos.x), toCartesianY(pos.y)]
            setMouseDownFunction( func );
            setMouseDownPoint(  new Vector(pos.x, toPixelsY(y)) )
        })

    }

    return (
        <div>
            <canvas style={{"border" : "1px solid green"}}
                onMouseDown={(e) => { setMouseDown(  { "mpos": getMousePos(e), "offset": offset } );} }
                onMouseUp={  (e) => {setMouseDown(null); setMouseDownFunction(null); setMouseDownPoint(null) }  } 
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseLeave={() => setMouseDown(null)}
                onWheel={(e) => handleWheel(e) }
                onContextMenu={(e) => handleClick(e) }
                

                width={props.width} 
                height={props.height}
                ref={canvas}
            ></canvas>
        </div>
    )
}

export default Graph;
