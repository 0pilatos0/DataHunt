import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Img from "./Img.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class Sprite extends Event{
    public static sprites: Array<Sprite> = []
    private _sprite?: HTMLCanvasElement

    constructor(path: string, size: Vector2 = new Vector2(Window.spriteSize, Window.spriteSize)){
        super()
        new Img(path).on('load', (img: HTMLImageElement) => {
            new Canvas(new Vector2(size.x, size.y)).on('load', (canvas: Canvas) => {
                canvas.ctx.drawImage(img, 0, 0, size.x, size.y)
                this._sprite = canvas.element
                Sprite.sprites.push(this)
                this.trigger('load', Sprite.sprites.indexOf(this))
            })
        })
    }

    get sprite(){
        return this._sprite
    }
}