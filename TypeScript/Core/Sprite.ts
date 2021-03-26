import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Vector2 from "./Vector2.js";

export default class Sprite extends Event{
    private _sprite: HTMLCanvasElement | null = null

    constructor(path: string, size: Vector2, data?: any){
        super()
        this.init(path, size, data)
    }

    private async init(path: string, size: Vector2, data?: any){
        let img = new Image()
        img.onload = () => {
            let canvas = new Canvas(new Vector2(img.width, img.height))
            canvas.ctx.drawImage(img, 0, 0, size.x, size.y)
            this._sprite = canvas.element
            this.trigger('load', this._sprite)
        }
        img.src = path
    }

    get sprite(){
        return this._sprite
    }
}