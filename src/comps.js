import React from 'react';
import {showCaretPos} from "./ce";
import katex from 'katex';


const InputFunction = (props) => {
    return(
        <div style={{"float" : "left"}}>
            <div style={{"position" : "absolute",height : "63px",
            width : "10px",
            backgroundColor : f.color}}></div>
            <div contentEditable={true}
            tabIndex={2}
            style={{"width" : "20%",
            border : "0",
            fontSize : "17px",
            padding : "15px",
            paddingBottom : "30px",
            backgroundColor : "#343434",
            color : "#fff",
            height : "100%"}}
            onKeyPress={(e) => {
            e.currentTarget.focus()
            print(showCaretPos(e.currentTarget))
            let msg = buffer + e.key
            props.setBuffer(prev => prev + e.key);
            katex.render(msg, e.currentTarget, {
                throwOnError: false
            });
            e.currentTarget.focus()
            }}
            ></div> 
        </div>

        )
}

export default InputFunction;