import Event from "./Event.js"
import Vector2 from "./Vector2.js"
import Window from "./Window.js"

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

    set size(size: Vector2){
        this._element.width = size.x
        this._element.height = size.y
    }

    get element(){
        return this._element
    }

    drawImage(image: CanvasImageSource, position: Vector2, size: Vector2 = new Vector2(image.width.toString(), image.height.toString())){
        this._ctx?.drawImage(image, position.x, position.y, size.x, size.y)
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number){
        this._ctx?.setTransform(a, b, c, d, e, f)
    }

    clearRect(position: Vector2, size: Vector2){
        this._ctx?.clearRect(position.x, position.y, size.x, size.y)
    }

    set fillStyle(color: string){
        if(this._ctx) this._ctx.fillStyle = color
    }

    fillRect(position: Vector2, size: Vector2){
        this._ctx?.fillRect(position.x, position.y, size.x, size.y)
    }

    set imageSmoothingEnabled(bool: boolean){
        if(this._ctx) this._ctx.imageSmoothingEnabled = bool
    }

    clear(){
        this._ctx?.clearRect(-Window.active.displaySize.x / 2, -Window.active.displaySize.y / 2, Window.active.displaySize.x, Window.active.displaySize.y)
    }
}