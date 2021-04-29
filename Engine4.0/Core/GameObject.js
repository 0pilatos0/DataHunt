import Animation from "./Animation.js";
import BoxCollider from "./Colliders/BoxCollider.js";
import Sprite from "./Sprite.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
export default class GameObject extends Transform {
    constructor(position, size, data = undefined, type = 0 /* DEFAULT */) {
        super(position, size);
        this._spriteIndex = -1;
        this._collider = null;
        this._animation = null;
        this._type = type;
        if (data) {
            this._spriteIndex = data.id;
            if (data.animation) {
                this._animation = new Animation();
                data.animation.map((a) => {
                    var _a;
                    (_a = this._animation) === null || _a === void 0 ? void 0 : _a.add(Tileset.tiles[a.id], a.duration);
                });
            }
            if (data.type) {
                let type = 0 /* DEFAULT */;
                switch (data.type) {
                    case "Collidable":
                        type = 1 /* COLLIDABLE */;
                        break;
                    case "Interactable":
                        type = 2 /* INTERACTABLE */;
                        break;
                    default:
                        break;
                }
                this._collider = new BoxCollider(new Vector2(position.x + data.colliderOffset.x, position.y + data.colliderOffset.y) || position, new Vector2(size.x + data.colliderSize.x, size.y + data.colliderSize.y) || size, this, type);
            }
        }
        this._visible = false;
        GameObject.gameObjects.push(this);
        this.trigger('load', this, true);
    }
    render(ctx) {
        if (this._visible) {
            if (this._animation)
                this._spriteIndex = this._animation.activeSpriteIndex;
            if (this._spriteIndex > -1)
                ctx.drawImage(Sprite.sprites[this._spriteIndex].sprite, this.position.x, this.position.y); //ctx.drawImage(Sprite.sprites[this._spriteIndex].sprite, this.position.x - Window.displayWidth / 2 - Camera.active.position.x, this.position.y - Window.displayHeight / 2 - Camera.active.position.y)
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
        GameObject.gameObjects.map(g => {
            if (g.type == type)
                rtn.push(g);
        });
        return rtn;
    }
    destroy() {
        GameObject.gameObjects.splice(GameObject.gameObjects.indexOf(this), 1);
    }
}
GameObject.gameObjects = [];
