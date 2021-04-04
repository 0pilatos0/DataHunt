import Event from "./Event.js";
import Vector2 from "./Vector2.js";
export default class Canvas extends Event {
    constructor(size = new Vector2(0, 0), keepGoing = false) {
        super();
        this._element = document.createElement('canvas');
        this._ctx = this._element.getContext('2d');
        this.size = size;
        if (this._ctx)
            this._ctx.imageSmoothingEnabled = false;
        this._element.style.imageRendering = "pixelated";
        this.trigger('load', this, keepGoing);
    }
    get ctx() {
        return this._ctx;
    }
    set size(size) {
        this._element.width = size.x;
        this._element.height = size.y;
    }
    get element() {
        return this._element;
    }
}
