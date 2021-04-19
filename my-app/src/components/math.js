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
    "strokeStyle": "#878a91",
    "shadowBlur" : 0,
}

const normalGridSettings = {
    "lineWidth" : 2,
    "strokeStyle": "#8f9192",
    "fillStyle" : "white",
    "font" : "13px sans-serif"
}

const normalFunctionSettings = {
    "lineWidth" : 2,
    "strokeStyle": "rgb(237, 52, 52)",
    // "shadowBlur" : 30,
    shadowColor: "white"
    
}

const normalTextSettings = {
    "lineWidth" : 2,
    "strokeStyle": "black",
    "fillStyle": "white",
    "shadowBlur" : 0,
}

const normalOuterGrid = {
    "lineWidth" : 1,
    "strokeStyle": "#333435",
}


export const getMousePos = (event) => 
{
    let delta = event.currentTarget.getBoundingClientRect();
    return new Vector(event.clientX - delta.x, event.clientY - delta.y);
}

export const settings = {
    "grid" : normalGridSettings,
    "outer_grid": normalOuterGrid,
    "axis": normalCrossSettings,
    "function" : normalFunctionSettings,
    "text": normalTextSettings
}
