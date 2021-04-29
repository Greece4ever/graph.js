import React, {useEffect, useState, useRef} from 'react'
import { addStyles, EditableMathField } from 'react-mathquill'
import MathLive from 'mathlive';
import {evaluate} from 'mathjs';


const color_blue = "#2c5a84";
const color_grey = "rgb(33 33 33)";

const randomColor = () => {
    let nums = [1, 2, 3];
    nums = nums.map(i => Math.round(Math.random() * 255));
    return `rgba(${nums.join(", ")})`;
}

const allowed_keys = Array.from("0123456789()x+-/*()")

let scope = {'ln': Math.log}


const InputFunction = (props) => {
    const [math_expr, setMathExpr] = useState("");
    const [color, setColor] = useState(color_grey);
    const [functionColor, setFunctionColor] = useState(randomColor());
    const [field, setField] = useState(null);

    const math_input = useRef();

    useEffect(() => {
        if (!math_input.current)
            return;

       let q=  MathLive.makeMathField(math_input.current,  {
            virtualKeyboardMode: "manual",
            virtualKeyboardLayout: 'dvorak',
            onFocus: () => {
                setColor(color_blue);
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
        try {
            console.log("func -> " , math_expr  )
            let func = evaluate( math_expr, scope  );
            if (typeof func != "function")
                return;
            try { 
                console.log("--> ", func(3.1415))
                props.setFunctions(prev => {
                    let prev_ = prev.slice();
                    console.log("set");
                    prev_[props.index] = [func, functionColor];
                    return prev_;
                })

            } catch(err2) {console.log(err2.message)}
        } catch(err) {console.log(err.message)}
    }, [math_expr])


    return (
        <div 

        onFocus={() => {
            field.focus();
            setColor(color_blue);
        }}

        onBlur={ () => {
            setColor(color_grey);   
        }}
        
        onClick={() => {
            field.focus();
            setColor(color_blue);
        }}
        
        style={{
            width: "100%",
            height: "58px",
            border: `1px solid ${color}`,
            justifyContent: "space-around",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            

            <div style={{
                position : "relative",
                width: "38px",
                height: "100%",
                backgroundColor: `${color}`,
                float: 'left',
                border: `1px solid ${color == color_grey ? "#252727" : color_blue}`
            }}> 

            <label className="blured" style={{"position": "absolute", fontSize: "10px", left: 0, top: 0}}>{props.index + 1}</label>
            
                <div style={{
                    "position" : "absolute",
                    "left" : "50%",
                    transform: "translate(-50%, -50%)",
                    "top" : "50%",

                }}>

                    <svg style={{
                        "color" : functionColor,
                        
                    }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-lightning-fill" viewBox="0 0 16 16">
                        <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
                    </svg>
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
