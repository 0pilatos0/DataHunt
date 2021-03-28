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
    set sprite(sprite) {
        this._sprite = sprite;
    }
    get visible() {
        return this._visible;
    }
    set visible(visible) {
        this._visible = visible;
    }
    colliding(gameObject) {
        return this.position.x < gameObject.position.x + gameObject.size.x &&
            this.position.x + this.size.x > gameObject.position.x &&
            this.position.y < gameObject.position.y + gameObject.size.y &&
            this.position.y + this.size.y > gameObject.position.y;
    }
}
