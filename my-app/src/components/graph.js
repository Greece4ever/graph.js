import React, { useEffect, useRef, useState } from 'react';
import {Vector, settings, getMousePos } from './math'

const Graph = (props) => {
    const canvas = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [offset, setOffset] = useState( new Vector(0, 0) );
    const [center, setCenter] = useState( new Vector(0, 0) );
    const [size, setSize] = useState( new Vector(0, 0) );
    const [zoom, setZoom] = useState( 40 );
    const [mouseDown, setMouseDown] = useState(null);
    const [increment, setIncrement] = useState(2);
    const [pixelUnitSize, setPixelUnitSize] = useState(100);
    const [add, setAdd] = useState(0);

    

    const applyContextSettings = (settings) => { 
        if (settings.gradient)
        {
            ctx.strokeStyle = settings.gradient(ctx);   
        }
        for (let setting in settings) 
        { 
            ctx[setting] = settings[setting]; 
        }   
    }
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
    const getBoundsX = () => [ Math.floor( toCartesianX( 0 ) ),  Math.ceil(  toCartesianX( size.x ) )  ]; 
    const getBoundsY = () => [ Math.floor( toCartesianY( 0 ) ),  Math.ceil(  toCartesianY( size.y ) )  ]; 

    useEffect(() => {
        if (!ctx)
            return;

        clear();

        let x_bounds = drawGrid();
        drawCrosses();
        drawFunction(x_bounds);
        drawPoints();
        drawText(x_bounds);    
    }, [ctx, center, increment])


    // how to find the numbers in a sequence before and after a number

    // 0,    2,   4,   6, 8
    // 0.3  0.6  0.9
    // f(x) = a0 + k*x
    // k*x = 57 =>
    // 57

    const next = (num) => {
        let previous_term = Math.floor(num / increment);
        return previous_term * increment
    }
    const prev = (num) => {
        let next_term = Math.floor(num / increment);
        return next_term * increment        
    }

    const drawText = (x_cords) => {
        let unitY = (toPixelsY(2) - toPixelsY(1) );
        ctx.beginPath();
        applyContextSettings(settings.text);
        
            for (let x=x_cords.start; x < x_cords.end; x += increment)
            {
                if (x != 0) {
                    let x_level = toPixelsX(x);
                    ctx.strokeText(`${x}`, x_level, toPixelsY(0));
                    ctx.fillText(`${x}`, x_level, toPixelsY(0));
                }    
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

            let unitY = toPixelsY(1) - toPixelsY(0)

            let _x = {"start" : prev(boundsX[0]), "end" :  next(boundsX[1]) } 
            let _y = {"start" : prev(boundsY[0]), "end" :  next(boundsY[1]) } 

            for (let x= _x.start; x <= _x.end; x += increment )
            {
                // if ( (x % increment) )
                    // continue;


                let x_level = toPixelsX(x);
                ctx.moveTo(x_level, 0);
                ctx.lineTo(x_level, size.y);                    
            }

            
            for (let y=_y.start; y >= _y.end; y -= increment )
            {
                // if ( (y % increment) )
                    // continue;
                
                let y_level = toPixelsY(y);
                ctx.moveTo(0, y_level);
                ctx.lineTo(size.x, y_level);            
            }
            ctx.stroke();
        ctx.closePath();

        return _x;
    }

    const drawFunction = (x_cords) => {
        applyContextSettings(settings.function)
        props.functions.forEach(_ => {
            let f  = _[0];
            let color = _[1];
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(toPixelsX(x_cords.start), toPixelsY(f(x_cords.start)))
                for (let x=x_cords.start; x < x_cords.end; x += 0.1)
                {
                    ctx.lineTo(toPixelsX(x), toPixelsY(f(x)))
                }
    
            ctx.stroke();
            ctx.closePath();    
        })
    }

    const drawPoints = () => {
        props.points.forEach(_ => {
            let cart_points = [];
            let points = _[0];
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

    const handleMouseMove = (e) => {
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
                return res <= 0 ? 0.1 : res;

            });
        }

        setAdd(prev => {
            if (prev > 10) {
                let unit_dist = toPixelsX(2) - toPixelsX(1);
                setIncrement(Math.round(pixelUnitSize / unit_dist) );
                return 0;        
            }
            return prev + 1;
        })

    }

    return (
        <div>
            <canvas style={{"border" : "1px solid green"}}
                onMouseDown={(e) => setMouseDown(  { "mpos": getMousePos(e), "offset": offset } ) }
                onMouseUp={  (e) => setMouseDown(null) } 
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseLeave={() => setMouseDown(null)}
                onWheel={(e) => handleWheel(e) }

                width={props.width} 
                height={props.height}
                ref={canvas}
            ></canvas>
        </div>
    )
}

export default Graph;
