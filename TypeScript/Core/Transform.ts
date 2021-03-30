import Event from "./Event.js";
import Vector2 from "./Vector2.js";

export default class Transform extends Event{
    private _position: Vector2
    private _size: Vector2

    constructor(position: Vector2, size: Vector2) {
        super()
        this._position = position
        this._size = size
    }

    set size(size){
        this._size = size
    }

    get size(){
        return this._size
    }

    set position(position){
        this._position = position
    }

    get position(){
        return this._position
    }
}