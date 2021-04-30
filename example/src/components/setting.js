import React, { useState } from "react";
import { SliderPicker, HuePicker, SketchPicker } from 'react-color'
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';

import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover'


import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css"
;
import { Button } from "@material-ui/core";

export const ColorSelect = (props) => {
    const [color, setColor] = useColor("hex", "#121212");
    const [open, setOpen] = useState(false);
  //   return <ColorPicker width={props.width} height={props.height} color={color} onChange={setColor} hideHSV dark />;
    return (
    <div>
        <Button onClick={e => setOpen(true)} style={{"background": "#3f51b5"}}>
            <Button    
            onClick={e => {
                setOpen(true)
            } } 
            
            style={{
                "background": color.hex,
                }}>

            </Button>

        </Button>

        <Popover
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}}
            transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
            <ColorPicker width={props.width} height={props.height} color={color} onChange={setColor} hideHSV dark />
        </Popover>
    </div>
    )
};


export const RangeSetting = () =>
{
    const [color, setColor] = useState("white");

    return (
        <div>
            <Slider />
        </div>
    )
}


export const SelectSetting = (props) => 
{
    const [value, setValue] = useState("None");

    return (
        <Select
        native
        value={value}
        // onChange={handleChange}
      >
        <option aria-label="None" value="" />
        {props.values.map(i => 
            <option onClick={e => setValue(i)} value={i}>{i}</option>
        )}
      </Select>
    )
}