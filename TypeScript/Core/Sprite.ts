import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Vector2 from "./Vector2.js";
declare var window: any
export default class Sprite extends Event{
    private _sprite: HTMLCanvasElement = document.createElement('canvas')

    constructor(path: string, size?: Vector2, data?: any){
        super()
        this.init(path, size, data)
    }

    private init(path: string, size?: Vector2, data?: any){
        let img = new Image()
        img.onload = () => {
            if(!size) size = new Vector2(window.spriteSize, window.spriteSize)
            let canvas = new Canvas(new Vector2(size.x, size.y))
            canvas.ctx.drawImage(img, 0, 0, size.x, size.y)
            this._sprite = canvas.element
            this.trigger('load', this._sprite)
            //console.log(data)
        }
        img.src = path
    }

    get sprite(){
        return this._sprite
    }
}