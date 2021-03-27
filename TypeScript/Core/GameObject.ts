import Event from "./Event.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
declare var window: any
export default class GameObject extends Event{
    private _position: Vector2
    private _size: Vector2
    private _sprite: Sprite
    private _visible: boolean = true

    constructor(position: Vector2, size: Vector2, sprite: Sprite = new Sprite('')){
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

    get position(){
        return this._position
    }

    get size(){
        return this._size
    }

    get sprite(){
        return this._sprite
    }

    get visible(){
        return this._visible
    }
}