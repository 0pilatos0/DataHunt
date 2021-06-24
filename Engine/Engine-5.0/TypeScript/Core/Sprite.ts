import Canvas from "./Canvas.js"
import Event from "./Event.js"
import Image from "./Image.js"
import Vector2 from "./Vector2.js"
import Window from "./Window.js"

export default class Sprite extends Event{
    public static sprites: Array<Sprite> = []

    private _sprite: Canvas

    constructor(src: string, size: Vector2 = new Vector2(Window.active.spriteSize, Window.active.spriteSize)){
        super()
        this._sprite = new Canvas(size)
        new Image(src).on('load', (img: HTMLImageElement) => { 
            this._sprite.drawImage(img, new Vector2(0, 0), size)
            Sprite.sprites.push(this)
            this.trigger('load', Sprite.sprites.indexOf(this))
        })
    }

    public get sprite(){
        return this._sprite.element
    }
}