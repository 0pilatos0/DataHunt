import Event from "./Event.js";
export default class Input extends Event {
    constructor() {
        super();
        this._keys = [];
        window.addEventListener('keydown', (e) => {
            if (this._keys.indexOf(e.key) == -1)
                this._keys.push(e.key);
            this.trigger(e.key);
        });
        window.addEventListener('keyup', (e) => {
            this._keys.splice(this._keys.indexOf(e.key), 1);
            this.trigger(e.key);
        });
    }
    set keys(keys) {
        this._keys = keys;
    }
    pressed(key) {
        if (this._keys.indexOf(key.toLowerCase()) > -1)
            return true;
        else if (this._keys.indexOf(key.toUpperCase()) > -1)
            return true;
        return false;
    }
}
