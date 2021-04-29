import Event from "./Event.js";
import Vector2 from "./Vector2.js";
export default class Canvas extends Event {
    constructor(size = new Vector2(0, 0)) {
        super();
        this._element = document.createElement('canvas');
        this._ctx = this._element.getContext('2d');
        this._element.width = size.x;
        this._element.height = size.y;
        this._ctx.imageSmoothingEnabled = false;
        this._element.style.imageRendering = "pixelated";
        this.trigger('load', this, true);
    }
    get element() {
        return this._element;
    }
    get ctx() {
        return this._ctx;
    }
}
