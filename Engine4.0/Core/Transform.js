import Event from "./Event.js";
export default class Transform extends Event {
    constructor(position, size) {
        super();
        this._position = position;
        this._size = size;
        this._position.on('change', () => {
            this.position = this._position;
        });
        this._size.on('change', () => {
            this.size = this._size;
        });
    }
    set size(size) {
        this._size = size;
        this.trigger('size');
    }
    get size() {
        return this._size;
    }
    set position(position) {
        this._position = position;
        this.trigger('position');
    }
    get position() {
        return this._position;
    }
}
