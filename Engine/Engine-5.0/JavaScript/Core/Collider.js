import GameObject from "./GameObject.js";
import Transform from "./Transform.js";
export default class Collider extends Transform {
    constructor(position, size, parentIndex, type = 0 /* DEFAULT */) {
        super(position, size);
        this._state = 0 /* DEFAULT */;
        this._oldState = this._state;
        this._colliders = [];
        this._parentIndex = parentIndex;
        this._type = type;
    }
    get parentIndex() {
        return this._parentIndex;
    }
    get parent() {
        return GameObject.gameObjects[this._parentIndex];
    }
    get type() {
        return this._type;
    }
    update() {
    }
}
