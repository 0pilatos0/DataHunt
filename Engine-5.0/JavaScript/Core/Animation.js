import Event from "./Event.js";
export default class Animation extends Event {
    constructor() {
        super();
        this._frames = [];
        this._activeSpriteIndex = -1;
        this._state = 2 /* PAUSED */;
        this.on('add', () => {
            let totalDuration = 0;
            this._frames.map(o => { totalDuration += o.duration; });
            clearInterval(this._interval);
            if (this._frames.length == 1)
                this._activeSpriteIndex = this._frames[0].spriteIndex;
            this._interval = setInterval(() => {
                if (this._state == 1 /* PLAYING */) {
                    for (let s = 0; s < this._frames.length; s++) {
                        setTimeout(() => {
                            this._activeSpriteIndex = this._frames[s].spriteIndex;
                        }, this._frames[s].duration * s);
                    }
                }
            }, totalDuration);
        });
    }
    add(spriteIndex, duration) {
        this._frames.push({ spriteIndex, duration });
        this.trigger('add');
    }
    get sprites() {
        let data = [];
        this._frames.map(f => { data.push(f.spriteIndex); });
        return data;
    }
    get activeSpriteIndex() {
        var _a;
        return (_a = this._activeSpriteIndex.id) !== null && _a !== void 0 ? _a : this._activeSpriteIndex;
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }
}
