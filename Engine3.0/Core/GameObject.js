import Event from "./Event.js";
export default class GameObject extends Event {
    constructor(position, size, sprite = null) {
        super();
        this._sprite = null;
        this._position = position;
        this._size = size;
        this._sprite = sprite;
        this.init();
    }
    init() {
        window.gameObjects.push(this);
        this.trigger('load');
    }
    render(ctx) {
    }
    update() {
    }
}
