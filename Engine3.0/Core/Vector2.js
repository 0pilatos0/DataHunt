import Event from "./Event.js";
export default class Vector2 extends Event {
    constructor(x, y) {
        super();
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
        this.trigger('change', this);
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
        this.trigger('change', this);
    }
    toString() {
        return `${this._x}, ${this._y}`;
    }
}
