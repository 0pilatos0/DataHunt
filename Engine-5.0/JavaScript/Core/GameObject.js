import Animation from "./Animation.js";
import BoxCollider from "./Colliders/BoxCollider.js";
import Sprite from "./Sprite.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";
export default class GameObject extends Transform {
    constructor(position, size, data = undefined, type = 0 /* DEFAULT */, keepTrying = false) {
        super(position, size);
        this._type = 0 /* DEFAULT */;
        this._spriteIndex = -1;
        this._collider = null;
        this._visible = false;
        this._animation = null;
        this._layer = 0;
        this._type = type;
        if (data) {
            this._spriteIndex = data.id;
            if (data.animation) {
                this._animation = new Animation();
                data.animation.map((a) => { var _a; (_a = this._animation) === null || _a === void 0 ? void 0 : _a.add(Tileset.tiles[a.id].id, a.duration); });
            }
            if (data.colliderType) {
                let type = 0 /* DEFAULT */;
                switch (data.colliderType) {
                    case "Collidable":
                        type = 1 /* COLLIDABLE */;
                        break;
                    case "Interactable":
                        type = 2 /* INTERACTABLE */;
                        break;
                    default:
                        break;
                }
                let pos = data.colliderOffset ? new Vector2(position.x + (data.colliderOffset.x * Window.active.spriteScaleFactor), position.y + (data.colliderOffset.y * Window.active.spriteScaleFactor)) : new Vector2(position.x, position.y);
                let si = data.colliderSize ? new Vector2(data.colliderSize.x * Window.active.spriteScaleFactor, data.colliderSize.y * Window.active.spriteScaleFactor) : new Vector2(size.x, size.y);
                this._collider = new BoxCollider(pos, si, GameObject.gameObjects.indexOf(this), type);
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
        GameObject.gameObjects.push(this);
        this.trigger('load', this, keepTrying);
    }
    render(canvas) {
        if (this._visible) {
            if (this._animation)
                this._spriteIndex = this._animation.activeSpriteIndex;
            if (this._spriteIndex > -1)
                canvas.drawImage(Sprite.sprites[this._spriteIndex].sprite, new Vector2(this.position.x - Window.active.displaySize.x / 2 - Window.active.scene.camera.position.x, this.position.y - Window.active.displaySize.y / 2 - Window.active.scene.camera.position.y));
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
    set collider(collider) {
        this._collider = collider;
        this.on('position', () => {
            if (this.collider)
                this.collider.position = this.position;
        });
        this.on('size', () => {
            if (this.collider)
                this.collider.size = this.size;
        });
    }
    get type() {
        return this._type;
    }
    get collider() {
        return this._collider;
    }
    set layer(layer) {
        this._layer = layer;
    }
    get layer() {
        return this._layer;
    }
    static getByType(type) {
        let rtn = [];
        GameObject.gameObjects.map(g => {
            if (g.type == type)
                rtn.push(g);
        });
        return rtn;
    }
    static get sortByLayer() {
        return GameObject.gameObjects.sort((a, b) => (a.layer > b.layer) ? 1 : -1);
    }
    destroy() {
        GameObject.gameObjects.splice(GameObject.gameObjects.indexOf(this), 1);
    }
}
GameObject.gameObjects = [];
