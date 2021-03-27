import Event from "./Event.js";
import Sprite from "./Sprite.js";
export default class GameObject extends Event {
    constructor(position, size, sprite = new Sprite('')) {
        super();
        this._visible = true;
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
    get position() {
        return this._position;
    }
    get size() {
        return this._size;
    }
    get sprite() {
        return this._sprite;
    }
    get visible() {
        return this._visible;
    }
}
