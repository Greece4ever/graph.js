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



export class RandomColorGenerator {
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

        this.index = 1
    }

    randomColorFromPallete()
    {
        if (this.index < this.pallete.length)
        {
            this.index++;
            return this.pallete[this.index - 1];
        }
        return 0;
    }

    randomBrightColor() {
        let $ = HSVtoRGB(getRandomInt(0, 360) / 360, getRandomInt(50, 90) / 100, getRandomInt(50, 100) / 100 );
        return `rgb(${$.r}, ${$.g}, ${$.b})`
    }

}
