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

function generateRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
};


export const randomColor = () => 
{
    let arr = [Math.random() * 255, Math.random() * 255, Math.random() * 255]
    let alpha = generateRandomNumber(0.5, 1.0);
    return `rgba(${ arr.join(",") + "," + alpha })`
}



const normalCrossSettings = {
    "lineWidth" : 2,
    "strokeStyle": "#7a7b7b",
    "shadowBlur": 0,
    "shadowColor": "white"
}

const normalGridSettings = {
    "lineWidth" : 1,
    "strokeStyle": "rgba(50, 51, 52, 1)",
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
