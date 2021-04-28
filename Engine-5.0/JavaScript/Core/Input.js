import Event from "./Event.js";
export default class Input extends Event {
    constructor() {
        super();
        this._keys = [];
        window.addEventListener('keydown', (e) => {
            if (this._keys.indexOf(e.key.toLowerCase()) == -1)
                this._keys.push(e.key.toLowerCase());
            this.trigger('press', e.key.toLowerCase());
        });
        window.addEventListener('keyup', (e) => {
            this._keys.splice(this._keys.indexOf(e.key.toLowerCase()), 1);
            this.trigger('release', e.key.toLowerCase());
        });
    }
    set keys(keys) {
        this._keys = keys;
    }
    pressed(key) {
        return this._keys.indexOf(key.toLowerCase()) > -1;
    }
}
