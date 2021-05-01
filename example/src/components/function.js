import React, {useEffect, useState, useRef} from 'react'
import { addStyles, EditableMathField } from 'react-mathquill'
import MathLive from 'mathlive';
import {evaluate} from 'mathjs';
import WarningIcon from '@material-ui/icons/Warning';
import Tooltip from '@material-ui/core/Tooltip';

const color_blue = "#2c5a84";
const color_grey = "rgb(33 33 33)";

const randomColor = () => {
    let nums = [1, 2, 3];
    nums = nums.map(i => Math.round(Math.random() * 255));
    return `rgba(${nums.join(", ")})`;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s;
        v = h.v; 
        h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}



class RandomColorGenerator {
    constructor()
    {
        this.pallete = [
            "",
            "#dd7776",
            "#5c95cb",
            "#4b9057",
            "#ac94de",
            "#dddddd",
            "#bcbcbd",
            "#5181ae",
            "#9a302d",
        ]

        this.index = 0
    }

    randomBrightColor() {
        let $ = HSVtoRGB(getRandomInt(0, 360) / 360, getRandomInt(60, 75) / 100, getRandomInt(70, 100) / 100 );
        return `rgb(${$.r}, ${$.g}, ${$.b})`
    }

}



let scope = {'ln': Math.log}

let generator = new RandomColorGenerator();


const InputFunction = (props) => {
    const [math_expr, setMathExpr] = useState("");
    const [color, setColor] = useState(color_grey);
    const [functionColor, setFunctionColor] = useState( generator.randomBrightColor() );
    const [field, setField] = useState(null);
    const [reload, setReload] = useState(null);

    const math_input = useRef();

    const [error, setError] = useState("Undeclraed symbol 'x'.");



    const handleNewFunction = () => {
        if (props.index + 1 !== props.length)
            return;
        props.setFunctions(prev => [...prev, [ x => NaN, "red" ] ]);
    }

    useEffect(() => {
        if (!math_input.current)
            return;

       let q=  MathLive.makeMathField(math_input.current,  {
            virtualKeyboardMode: "manual",
            virtualKeyboardLayout: 'dvorak',
            onFocus: () => {
                setColor(color_blue);
                setReload(Math.random());
            },
            onContentDidChange: (mf) => {
                setMathExpr( mf.getValue('ascii-math')
                .replaceAll("⋅", "*")
            
            )
                
            }
        });

        setField(q);

    }, [math_input])

    useEffect(() => {
        if (!reload)
            return;

        props.setSelected(props.index);
        handleNewFunction();
    }, [reload]);

    useEffect(() => {
        try {

            let expr = math_expr;
            if (!expr.includes("=") )
                expr = `f(x)=${expr}`;

            let func = evaluate( expr, scope  );
            if (typeof func != "function")
                return;
            try { 
                let ____;
                ____ = func(-3.1415);
                ____ = func(Math.PI);
                props.setFunctions(prev => {
                    let prev_ = prev.slice();
                    // console.log("set");
                    prev_[props.index] = [func, functionColor];
                    return prev_;
                })

            } catch(err2) {
                setError(err2.message);
                console.log("err2", err2.message)
                return
            }
        } catch(err) {
            setError(err.message);
            console.log("err1", err.message)
            return
        
        }
        setError(null);
    }, [math_expr])


    return (
        <div 

        onFocus={() => {
            field.focus();
            setColor(color_blue);
        }}

        onBlur={ () => {
            props.setSelected(null);
            // setColor(color_grey);   
        }}
        
        onClick={() => {
            field.focus();
            props.setSelected(props.index);
            // setColor(color_blue);
        }}
        
        style={{
            width: "100%",
            height: "58px",
            border: `1px solid ${props.selected === props.index ? color_blue : color_grey}`,
            justifyContent: "space-around",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            

            <div style={{
                position : "relative",
                width: "38px",
                height: "100%",
                backgroundColor: `${props.selected === props.index ? color_blue : color_grey}`,
                float: 'left',
                border: `1px solid ${props.selected !== props.index ? "#252727" : color_blue}`
            }}> 

            <label className="blured" style={{"position": "absolute", fontSize: "10px", left: 0, top: 0}}>{props.index + 1}</label>



            

                <div style={{
                    "position" : "absolute",
                    "left" : "50%",
                    transform: "translate(-50%, -50%)",
                    "top" : "50%",

                }}>
                    {
                        error ? 
                    <Tooltip title={error}>
                        <WarningIcon style={{"color": "#d88181"}} />
                    </Tooltip> :

                        <svg style={{
                            "color" : functionColor,
                            
                        }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-lightning-fill" viewBox="0 0 16 16">
                            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
                        </svg>
                    }


                </div>


            </div>


            <div style={{
                "color": "white",
                float: 'left',
                width: "calc( 100% - 38px )",
            }}>

                <div ref={math_input} 
                    style={{
                        position: "relative",
                        marginLeft: "10px",
                        fontSize: "120%",
                        width: "calc(100% - 10px)"
                    }}
                ></div>            

            </div>
        

        </div>
    )
}

export default InputFunction;
