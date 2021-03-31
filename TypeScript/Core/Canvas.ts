import Vector2 from "./Vector2.js"

export default class Canvas{
    private _element: HTMLCanvasElement = document.createElement('canvas')
    private _ctx: any = this._element.getContext('2d')

    constructor(size: Vector2 = new Vector2(0, 0)){
        this._element.width = size.x
        this._element.height = size.y
        this._ctx.imageSmoothingEnabled = false
        this._element.style.imageRendering = "pixelated"
    }

    get element(){
        return this._element
    }

    get ctx(): CanvasRenderingContext2D{
        return this._ctx
    }
}