import BoxCollider from "./BoxCollider.js";
import Camera from "./Camera.js";
import Sprite from "./Sprite.js";
import Transform from "./Transform.js";
import Window from "./Window.js";
export default class GameObject extends Transform {
    constructor(position, size, spriteIndex = -1, type = 0 /* DEFAULT */) {
        var _a, _b;
        super(position, size);
        this._visible = false;
        this._animation = null;
        this._collider = null;
        this._spriteIndex = spriteIndex;
        this._type = type;
        (_a = Sprite.sprites[this.spriteIndex]) === null || _a === void 0 ? void 0 : _a.on('animation', (animation) => { this._animation = animation; });
        GameObject.gameObjects.push(this);
        this.trigger('load', this, true);
        if (((_b = Sprite.sprites[this.spriteIndex]) === null || _b === void 0 ? void 0 : _b.type) != 0 /* DEFAULT */) {
            this._collider = new BoxCollider(position, size, this);
            this.on('position', () => {
                if (this.collider)
                    this.collider.position = this.position;
            });
            this.on('size', () => {
                if (this.collider)
                    this.collider.size = this.size;
            });
        }
    }
    render(ctx) {
        if (this._visible) {
            if (this._animation)
                this._spriteIndex = this._animation.activeSpriteIndex;
            if (this._spriteIndex > -1)
                ctx.drawImage(Sprite.sprites[this._spriteIndex].sprite, this.position.x - Window.displayWidth / 2 - Camera.active.position.x, this.position.y - Window.displayHeight / 2 - Camera.active.position.y);
        }
    }
    update() {
        var _a;
        (_a = this.collider) === null || _a === void 0 ? void 0 : _a.update();
    }
    get spriteIndex() {
        return this._spriteIndex;
    }
    set spriteIndex(spriteIndex) {
        this._spriteIndex = spriteIndex;
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
    get collider() {
        return this._collider;
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
    destroy() {
        GameObject.gameObjects.splice(GameObject.gameObjects.indexOf(this), 1);
    }
}
GameObject.gameObjects = [];
