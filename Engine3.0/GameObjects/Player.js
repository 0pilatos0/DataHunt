import GameObject from "../Core/GameObject.js";
import Tileset from "../Core/Tileset.js";
import Vector2 from "../Core/Vector2.js";
export default class Player extends GameObject {
    constructor(position, size, controllable = false) {
        super(position, size);
        this._controllable = false;
        this._keysPressed = new Array;
        this._speed = 500;
        this._oldPosition = new Vector2(this.position.x, this.position.y);
        this._animations = [];
        this._controllable = controllable;
        this.initialize();
    }
    initialize() {
        if (this._controllable) {
            window.player = this;
            document.body.addEventListener('keydown', this.keydown);
            document.body.addEventListener('keyup', this.keyup);
            new Tileset("/Engine3.0/Players/Player1.png").on('load', (tileset) => {
                console.log(tileset);
                for (let i = 0; i < tileset.tiles.length; i++) {
                }
                this.trigger('load');
            });
        }
    }
    render(ctx) {
        super.render(ctx);
    }
    update() {
        super.update();
        this._oldPosition = new Vector2(this.position.x, this.position.y);
    }
    keydown(e) {
        if (this._keysPressed.indexOf(e.key) == -1)
            this._keysPressed.push(e.key);
    }
    keyup(e) {
        this._keysPressed.splice(this._keysPressed.indexOf(e.key), 1);
    }
}
