import Animation from "./Animation.js";
import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";
export default class Sprite extends Event {
    constructor(path, size, data, tileset) {
        super();
        this._sprite = document.createElement('canvas');
        this._type = 0 /* DEFAULT */;
        this.init(path, size, data, tileset);
    }
    init(path, size, data, tileset) {
        let img = new Image();
        img.onload = () => {
            if (!size)
                size = new Vector2(Window.spriteSize, Window.spriteSize);
            let canvas = new Canvas(new Vector2(size.x, size.y));
            canvas.ctx.drawImage(img, 0, 0, size.x, size.y);
            this._sprite = canvas.element;
            //console.log(data)
            //TODO set type of sprite to gameobject
            //TODO set some parameters on gameobject instead of sprite
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
                tileset === null || tileset === void 0 ? void 0 : tileset.on('load', () => {
                    let animation = new Animation();
                    for (let a = 0; a < (data === null || data === void 0 ? void 0 : data.animation.length); a++) {
                        animation.add(tileset.tiles[data.animation[a].tileid], data.animation[a].duration);
                    }
                    this.trigger('animation', animation);
                });
            }
            Sprite.sprites.push(this);
            this.trigger('load', Sprite.sprites.indexOf(this));
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
Sprite.sprites = [];
