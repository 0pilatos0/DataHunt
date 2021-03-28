import Animation from "./Animation.js";
import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Tileset from "./Tileset.js";
import Vector2 from "./Vector2.js";
export default class Sprite extends Event {
    constructor(path, size, data) {
        super();
        this._sprite = document.createElement('canvas');
        this._type = 0 /* DEFAULT */;
        this.init(path, size, data);
    }
    init(path, size, data) {
        let img = new Image();
        img.onload = () => {
            if (!size)
                size = new Vector2(window.spriteSize, window.spriteSize);
            let canvas = new Canvas(new Vector2(size.x, size.y));
            canvas.ctx.drawImage(img, 0, 0, size.x, size.y);
            this._sprite = canvas.element;
            this.trigger('load', this);
            //console.log(data)
            switch (data === null || data === void 0 ? void 0 : data.type) {
                case "Collidable":
                    this._type = 1 /* COLLIDABLE */;
                    break;
                case "Interactable":
                    this._type = 2 /* INTERACTABLE */;
                    break;
                default:
                    this._type = 0 /* DEFAULT */;
                    break;
            }
            if (data === null || data === void 0 ? void 0 : data.animation) {
                window.map.on('load', () => {
                    let animation = new Animation();
                    for (let a = 0; a < (data === null || data === void 0 ? void 0 : data.animation.length); a++) {
                        let anim = data.animation[a];
                        animation.addSprite(Tileset.tiles[anim.tileid], anim.duration);
                    }
                    animation.on('change', (sprite) => {
                        this._sprite = sprite.sprite;
                    });
                });
            }
        };
        img.src = path;
    }
    get sprite() {
        return this._sprite;
    }
    get type() {
        return this._type;
    }
}
