import Event from "./Event.js";
import Sprite from "./Sprite.js";
export default class GameObject extends Event {
    constructor(position, size, sprite = new Sprite(''), type = 0 /* DEFAULT */) {
        super();
        this._visible = true;
        this._position = position;
        this._size = size;
        this._sprite = sprite;
        this._type = type;
        this.sprite.on('animation', (animation) => {
            animation.on('change', (sprite) => {
                this.sprite = sprite;
            });
        });
        this.init();
    }
    init() {
        GameObject.gameObjects.push(this);
        this.trigger('load', this);
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
    get type() {
        return this._type;
    }
    colliding(gameObject) {
        return this.position.x < gameObject.position.x + gameObject.size.x &&
            this.position.x + this.size.x > gameObject.position.x &&
            this.position.y < gameObject.position.y + gameObject.size.y &&
            this.position.y + this.size.y > gameObject.position.y;
    }
    static getByType(type) {
        let rtn = [];
        for (let g = 0; g < GameObject.gameObjects.length; g++) {
            let gameObject = GameObject.gameObjects[g];
            if (gameObject.type == type)
                rtn.push(gameObject);
        }
        return rtn;
    }
}
GameObject.gameObjects = [];
