import Event from "./Event.js"
import Vector2 from "./Vector2.js"

export default class Canvas extends Event{
    private _element: HTMLCanvasElement = document.createElement('canvas')
    private _ctx: CanvasRenderingContext2D | null = this._element.getContext('2d')

    constructor(size: Vector2 = new Vector2(0, 0), keepGoing: boolean = false){
        super()
        this.size = size
        if(this._ctx) this._ctx.imageSmoothingEnabled = false
        this._element.style.imageRendering = "pixelated"
        this.trigger('load', this, keepGoing)
    }

    get ctx(){
        return this._ctx
    }

    set size(size: Vector2){
        this._element.width = size.x
        this._element.height = size.y
    }

    get element(){
        return this._element
    }
}