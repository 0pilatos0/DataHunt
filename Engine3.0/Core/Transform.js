import Event from "./Event.js";
export default class Transform extends Event {
    constructor(position, size) {
        super();
        this._position = position;
        this._size = size;
    }
    set size(size) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
    set position(position) {
        this._position = position;
    }
    get position() {
        return this._position;
    }
}
