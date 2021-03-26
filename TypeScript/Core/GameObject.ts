import Event from "./Event.js";
import Vector2 from "./Vector2.js";
declare var window: any
export default class GameObject extends Event{
    private _position: Vector2
    private _size: Vector2
    private _sprite: HTMLCanvasElement | null = null

    constructor(position: Vector2, size: Vector2, sprite: HTMLCanvasElement | null = null){
        super()
        this._position = position
        this._size = size
        this._sprite = sprite
        this.init()
    }

    private init(){
        window.gameObjects.push(this)
        this.trigger('load')
    }

    private render(ctx: CanvasRenderingContext2D){

    }

    private update(){

    }
}