import Event from "./Event.js";
export default class Animation extends Event {
    constructor() {
        super();
        this._sprites = [];
        this.init();
    }
    init() {
        let totalDuration = 0;
        this.on('add', () => {
            totalDuration = 0;
            this._sprites.map(o => { totalDuration += o.duration; });
        });
        setInterval(() => {
            for (let s = 0; s < this._sprites.length; s++) {
                let o = this._sprites[s];
                setTimeout(() => {
                    this.trigger('change', o.sprite);
                }, o.duration * s);
            }
        }, totalDuration);
    }
    addSprite(sprite, duration) {
        this._sprites.push({ sprite, duration });
        this.trigger('add');
    }
}
