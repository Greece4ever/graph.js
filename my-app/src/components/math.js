export class Vector
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    _()
    {
        return [this.x, this.y];
    }
}


function createGradient(ctx) {
    let grd = ctx.createLinearGradient(0, 0, 200, 0);
      grd.addColorStop(0, "rgba(19, 118, 138, 1)");
      grd.addColorStop(1, "rgba(50, 98, 168)");
      grd.addColorStop(0, "rgba(19, 62, 89, 1)");
    return grd;
}


const normalCrossSettings = {
    "lineWidth" : 2,
    "strokeStyle": "rgb(156, 158, 161)",
    "strokeColor": "rgb(220, 218, 220)",
    "shadowBlur": 0,
    "shadowColor": "white"
}

const normalGridSettings = {
    "lineWidth" : 1,
    "strokeStyle": "rgba(50, 51, 52, 1)",
    "strokeColor": "white",
    "shadowBlur": 0,
    "shadowColor": "white",
    "fillStyle" : "white",
    "font" : "13px sans-serif"
}

const normalFunctionSettings = {
    "lineWidth" : 2,
    "strokeStyle": "rgb(237, 52, 52)",
    "strokeColor": "white",
    "shadowBlur": 0,
    "shadowColor": "white",
}

const normalTextSettings = {
    "lineWidth" : 2,
    "strokeStyle": "black",
    "fillStyle": "white",
    "strokeColor": "white",
    "shadowBlur": 0,
    "shadowColor": "white",
}


export const getMousePos = (event) => 
{
    let delta = event.currentTarget.getBoundingClientRect();
    return new Vector(event.clientX - delta.x, event.clientY - delta.y);
}

export const settings = {
    "grid" : normalGridSettings,
    "axis": normalCrossSettings,
    "function" : normalFunctionSettings,
    "text": normalTextSettings
}
