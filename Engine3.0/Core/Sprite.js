import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Vector2 from "./Vector2.js";
export default class Sprite extends Event {
    constructor(path, size, data) {
        super();
        this._sprite = document.createElement('canvas');
        this.init(path, size, data);
    }
    init(path, size, data) {
        let img = new Image();
        img.onload = () => {
            if (!size)
                size = new Vector2(window.spriteSize, window.spriteSize);
            let canvas = new Canvas(new Vector2(size.x, size.y));
            canvas.ctx.drawImage(img, 0, 0, size.x, size.y);
            this._sprite = canvas.element;
            this.trigger('load', this);
            //console.log(data)
        };
        img.src = path;
    }
    get sprite() {
        return this._sprite;
    }
}
