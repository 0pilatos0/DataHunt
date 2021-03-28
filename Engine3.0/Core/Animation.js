import Event from "./Event.js";
export default class Animation extends Event {
    constructor() {
        super();
        this._frames = [];
        this.init();
    }
    init() {
        this.on('add', () => {
            let totalDuration = 0;
            this._frames.map(o => { totalDuration += o.duration; });
            clearInterval(this._interval);
            this._interval = setInterval(() => {
                for (let s = 0; s < this._frames.length; s++) {
                    setTimeout(() => {
                        this.trigger('change', this._frames[s].sprite);
                    }, this._frames[s].duration * s);
                }
            }, totalDuration);
        });
    }
    add(sprite, duration) {
        this._frames.push({ sprite, duration });
        this.trigger('add');
    }
    get sprites() {
        let data = [];
        this._frames.map(f => { data.push(f.sprite); });
        return data;
    }
}
