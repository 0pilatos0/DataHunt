import Event from "./Event.js";

export default class Vector2 extends Event{
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        super()
        this._x = x;
        this._y = y;
    }

    public get x() {
        return this._x;
    }

    public set x(x: number) {
        this._x = x;
        this.trigger('change', this)
    }

    public get y() {
        return this._y;
    }

    public set y(y: number) {
        this._y = y;
        this.trigger('change', this)
    }

    public toString(){
        return `${this._x}, ${this._y}`
    }
}