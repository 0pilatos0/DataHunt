import Transform from "./Transform.js";
export default class Collider extends Transform {
    constructor(position, size, parent, type = 0 /* DEFAULT */) {
        super(position, size);
        this._state = 0 /* DEFAULT */;
        this._oldState = this._state;
        this._colliders = [];
        this._parent = parent;
        this._type = type;
    }
    get parent() {
        return this._parent;
    }
    get type() {
        return this._type;
    }
    update() {
    }
}
