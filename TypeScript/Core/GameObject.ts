import Animation from "./Animation.js";
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
        this.sprite.on('animation', (animation: Animation) => {
            animation.on('change', (sprite: Sprite) => {
                this.sprite = sprite
            })
        })
        this.init()
    }

    private init(){
        //window.gameObjects.push(this)
        this.trigger('load', this)
    }

    public render(ctx: CanvasRenderingContext2D){

    }

    public update(){

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
    
    set sprite(sprite: Sprite){
        this._sprite = sprite
    }

    get visible(){
        return this._visible
    }

    set visible(visible: boolean){
        this._visible = visible
    }

    public colliding(gameObject: GameObject){
        return this.position.x < gameObject.position.x + gameObject.size.x &&
        this.position.x + this.size.x > gameObject.position.x &&
        this.position.y < gameObject.position.y + gameObject.size.y &&
        this.position.y + this.size.y > gameObject.position.y
    }
}