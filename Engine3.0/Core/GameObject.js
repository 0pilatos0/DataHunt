import Event from "./Event.js";
import Sprite from "./Sprite.js";
export default class GameObject extends Event {
    constructor(position, size, sprite = new Sprite(''), type = 0 /* DEFAULT */) {
        super();
        this._visible = true;
        this._beenRendered = false;
        this._animation = null;
        this._position = position;
        this._size = size;
        this._sprite = sprite;
        this._type = type;
        this.sprite.on('animation', (animation) => { this._animation = animation; });
        this.init();
    }
    init() {
        GameObject.gameObjects.push(this);
        this.trigger('load', this);
    }
    render(ctx) {
        if (!this._beenRendered)
            return;
        if (this._animation)
            this._sprite = this._animation.activeSprite;
    }
    update() {
        if (!this._beenRendered)
            return;
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
        if (this._animation) {
            if (!visible)
                this._animation.state = 2 /* PAUSED */;
            else if (visible)
                this._animation.state = 1 /* PLAYING */;
        }
    }
    get type() {
        return this._type;
    }
    get beenRendered() {
        return this._beenRendered;
    }
    set beenRendered(beenRendered) {
        this._beenRendered = beenRendered;
        if (this._animation) {
            if (!beenRendered)
                this._animation.state = 2 /* PAUSED */;
            else if (beenRendered)
                this._animation.state = 1 /* PLAYING */;
        }
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
