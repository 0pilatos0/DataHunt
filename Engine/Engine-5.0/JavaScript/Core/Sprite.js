import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Image from "./Image.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";
export default class Sprite extends Event {
    constructor(src, size = new Vector2(Window.active.spriteSize, Window.active.spriteSize)) {
        super();
        this._sprite = new Canvas(size);
        new Image(src).on('load', (img) => {
            this._sprite.drawImage(img, new Vector2(0, 0), size);
            Sprite.sprites.push(this);
            this.trigger('load', Sprite.sprites.indexOf(this));
        });
    }
    get sprite() {
        return this._sprite.element;
    }
}
Sprite.sprites = [];
