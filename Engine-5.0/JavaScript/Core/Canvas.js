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
    set size(size) {
        this._element.width = size.x;
        this._element.height = size.y;
    }
    get element() {
        return this._element;
    }
    drawImage(image, position, size = new Vector2(image.width.toString(), image.height.toString())) {
        var _a;
        (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.drawImage(image, position.x, position.y, size.x, size.y);
    }
    setTransform(a, b, c, d, e, f) {
        var _a;
        (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.setTransform(a, b, c, d, e, f);
    }
    clearRect(position, size) {
        var _a;
        (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.clearRect(position.x, position.y, size.x, size.y);
    }
    set fillStyle(color) {
        if (this._ctx)
            this._ctx.fillStyle = color;
    }
    fillRect(position, size) {
        var _a;
        (_a = this._ctx) === null || _a === void 0 ? void 0 : _a.fillRect(position.x, position.y, size.x, size.y);
    }
    set imageSmoothingEnabled(bool) {
        if (this._ctx)
            this._ctx.imageSmoothingEnabled = bool;
    }
}
