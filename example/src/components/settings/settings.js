import React, { useEffect, useState } from "react";
import Fab from '@material-ui/core/Fab'
import SettingsIcon from '@material-ui/icons/Settings';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import {createDefaultSettings, settings_prototype} from './default_settings';




import {RangeSetting, SelectSetting, ColorSelect} from './setting'

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }


  



const Settings = (props) => {

    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState(0);


    useEffect(() => {
        if (!open)
            return;
        
        props.setCurrentSettings(props.unAppliedSettings);
    }, [open])

    
    return(
        <div style={{"position": "absolute", "right": 0, "bottom": 0, marginRight:"10px", marginBottom: "10px"}}>

            <Fab
            onClick={() => {
                setOpen(true);
            }}

            className={"shadow"}  style={{
                "background": "#2a2d2f",
                
            }} size={"medium"}  color="contained" aria-label="Settings">
                <SettingsIcon style={{
                    color: "rgb(255, 255, 255)"
                }} />
            </Fab>

      <Dialog 

        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

        style={{"border": 0}}
      >
        <DialogTitle style={{"color": "rgb(177, 176, 175)"}} className="black" id="alert-dialog-title">{"Canvas Settings"}</DialogTitle>
        <DialogContent  className="black" >

            <AppBar position="static">
                <Tabs style={{
                    background: "#181a1b"
                }} value={selected} variant="scrollable"  aria-label="simple tabs example">
                    {props.settings.map( (item, index) => 
                        <Tab 
                        onClick={e => setSelected(index)}
                        style={{
                            "background": "rgb(24, 26, 27)"
                        }} label={item.name} {...a11yProps(index)} />    
                    )}    
                </Tabs>
            </AppBar>
            {
                props.settings.map( (item, index) =>
                    <TabPanel value={selected}  index={index}>
                        {props.settings_prototype.map(setting => {                            
                            return (
                            <div style={{"marginTop": "10px"}}>
                                <Typography variant="h5" gutterBottom>
                                    <div className={"heading"} style={{"color": "white"}}>
                                        {setting.name}
                                    </div>
                                </Typography>
                                <div style={{"display": "flex", marginBottom: "30px", position: "relative"}}>
                                    <div className={"muted"}  style={{"width": "50%"}}>
                                        <div style={{"width": "90%"}}>
                                            {setting.description}
                                        </div>
                                    </div>

                                    <div style={{"width": "50%"}}>
                                    { (() => {
                                        switch(setting.type)
                                        {
                                            case "range":
                                                return (
                                                <div style={{}}>
                                                    <RangeSetting name={item.property}  unAppliedSettings={props.unAppliedSettings} setNewSettings={props.setUnApliedSettings} property={setting.property} range={setting.range} />
                                                </div>
                                                );
                                            case "select":
                                                return (
                                                    <div style={{'float': "right"}}>
                                                        <SelectSetting setting_name={setting.name} name={item.property} unAppliedSettings={props.unAppliedSettings} setNewSettings={props.setUnApliedSettings} property={setting.property} values={setting.options} />
                                                    </div>
                                                );
                                            case "color":
                                                return (
                                                    <div style={{"float": "right"}}>
                                                        <ColorSelect name={item.property} unAppliedSettings={props.unAppliedSettings} setNewSettings={props.setUnApliedSettings} property={setting.property} width={200} height={100} />
                                                    </div>
                                                );
                                        }
                                    })() }
                                    </div>
                                </div>
                                <Divider  variant="inset" />
                            </div>)
                        })}
                    </TabPanel>        
                )
            }



        </DialogContent>
        <DialogActions className="black">
          <Button variant="contained" onClick={e => setOpen(false)} color="secondary">
            CANCEL
          </Button>
          <Button variant="contained" onClick={e => setOpen(false)} color="primary" autoFocus>
            APPLY
          </Button>
        </DialogActions>
      </Dialog>


        </div>
    )
}

export default Settings;
