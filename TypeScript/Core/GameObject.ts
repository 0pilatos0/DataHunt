import Animation, { AnimationState } from "./Animation.js";
import Event from "./Event.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
declare var window: any

export const enum GameObjectType{
    DEFAULT,
    SPAWNPOINT
}

export default class GameObject extends Event{
    static gameObjects: Array<GameObject> = []
    private _position: Vector2
    private _size: Vector2
    private _sprite: Sprite
    private _visible: boolean = true
    private _type: GameObjectType
    private _beenRendered: boolean = false
    private _animation: Animation | null = null

    constructor(position: Vector2, size: Vector2, sprite: Sprite = new Sprite(''), type: GameObjectType = GameObjectType.DEFAULT){
        super()
        this._position = position
        this._size = size
        this._sprite = sprite
        this._type = type
        this.sprite.on('animation', (animation: Animation) => {
            this._animation = animation
            animation.on('change', (sprite: Sprite) => {
                this.sprite = sprite
            })
        })
        this.init()
    }

    private init(){
        GameObject.gameObjects.push(this)
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
        if(this._animation){
            if(!visible) this._animation.state = AnimationState.PAUSED 
            else if(visible) this._animation.state = AnimationState.PLAYING 
        }
    }

    get type(){
        return this._type
    }

    get beenRendered(){
        return this._beenRendered
    }

    set beenRendered(beenRendered: boolean){
        this._beenRendered = beenRendered
        if(this._animation){
            if(!beenRendered) this._animation.state = AnimationState.PAUSED
            else if(beenRendered) this._animation.state = AnimationState.PLAYING
        } 
    }

    public colliding(gameObject: GameObject){
        return this.position.x < gameObject.position.x + gameObject.size.x &&
        this.position.x + this.size.x > gameObject.position.x &&
        this.position.y < gameObject.position.y + gameObject.size.y &&
        this.position.y + this.size.y > gameObject.position.y
    }

    static getByType(type: GameObjectType){
        let rtn: Array<GameObject> = []
        for (let g = 0; g < GameObject.gameObjects.length; g++) {
            let gameObject = GameObject.gameObjects[g]
            if(gameObject.type == type) rtn.push(gameObject)
        }
        return rtn
    }
}