import React, { useEffect, useState } from "react";
import { SliderPicker, HuePicker, SketchPicker } from 'react-color'
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';

import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover'


import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css"
;
import { Button } from "@material-ui/core";

import Draggable from 'react-draggable'; // The default

import OpenWithIcon from '@material-ui/icons/OpenWith';

import CloseIcon from '@material-ui/icons/Close';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import { deepClone2D } from "./default_settings";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  

export const ColorSelect = (props) => {
    const [color, setColor] = useColor("hex", "#121212");
    const [open, setOpen] = useState(false);


    useEffect(() => {
        props.setNewSettings(prev => {
            let clone = deepClone2D(prev);
            clone[props.name][props.property] = color.hex;
            return clone;
        })
    }, [color])


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

        <Button onClick={() => {
            setOpen(false);
        }}   style={{
            "position": "fixed",
            right: 0,
            top: 0,
            visibility: open ? "visible": "hidden",
            marginRight: "20px",
            marginTop: "20px",
            zIndex: 0,
            cursor: "pointer"
            }}>
                <CloseIcon style={{
                    "color": "#bbafaf"
                }} />
        </Button>


        <Draggable handle=".handle">
            <Popover onKeyDown={e => {
                if (e.code === "Escape")
                {
                    setOpen(false);
                }
            }}
                open={open}
                
                anchorReference="anchorPosition"
                anchorPosition={{ top: 200, left: 400 }}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}              
>
                <div >

                    <div style={{position: "relative", border: "10px solid #1d1d1d", background: "#1d1d1d"}}>
                    <ColorPicker width={props.width} height={props.height} color={color} 
                        
                        onChange={e => {
                            setColor(e);
                        }}
                        
                        hideHSV dark />
                    </div>
                    <div 
                    
                    

                    style={{
                        "textAlign": "center",
                        "color": "antiquewhite",
                        cursor: "move"
                    
                        }} className={"handle"}>
                        <OpenWithIcon />
                    </div>

                </div>
            </Popover>
        </Draggable>
    </div>
    )
};


export const RangeSetting = (props) =>
{
    const [value, setValue] = useState();

    return (
        <div>
            <Slider 
            valueLabelFormat={value}
            aria-labelledby="discrete-slider-restrict"
            valueLabelDisplay="auto"

            value={props.unAppliedSettings[props.name][props.property]}

            min={props.range[0]}
            max={props.range[1]}

            onChange={ (e, value) => {
                props.setNewSettings(prev => {
                    let clone = deepClone2D(prev);
                    
        
                    clone[props.name][props.property] = value;
                    return clone;
                })        
            }}

            />
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  


export const SelectSetting = (props) => 
{
    const classes = useStyles();

    const handleChange = e => {
        props.setNewSettings(prev => {
            let clone = deepClone2D(prev);
            clone[props.name][props.property] = e.target.value;
            return clone;
        })
    }

    return (
        <FormControl style={{"background": "#181a1b"}}  className={classes.formControl}>
        <InputLabel style={{
            "color": "rgb(63, 81, 181)"
        }} id="demo-simple-select-label">{props.setting_name}</InputLabel>
            <Select

            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.unAppliedSettings[props.name][props.property]}
            onChange={e => handleChange(e)}
            >

            {props.values.map(i => 
                <MenuItem style={{
                    "background": "#181a1b",
                    color: "#3d4eae"
                }} value={i}>{capitalizeFirstLetter(i)}</MenuItem>
            )}

            </Select>
      </FormControl>
    )
}
