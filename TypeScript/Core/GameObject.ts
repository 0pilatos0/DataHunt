import Animation from "./Animation.js";
import BoxCollider from "./BoxCollider.js";
import Camera from "./Camera.js";
import Collider from "./Collider.js";
import AnimationState from "./Enums/AnimationState.js";
import GameObjectType from "./Enums/GameObjectState.js";
import SpriteType from "./Enums/SpriteType.js";
import Event from "./Event.js";
import Sprite from "./Sprite.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class GameObject extends Transform{
    static gameObjects: Array<GameObject> = []
    private _spriteIndex: number
    private _visible: boolean = false
    private _type: GameObjectType
    private _animation: Animation | null = null
    private _collider: Collider | null = null

    constructor(position: Vector2, size: Vector2, spriteIndex: number = -1, type: GameObjectType = GameObjectType.DEFAULT){
        super(position, size)
        this._spriteIndex = spriteIndex
        this._type = type
        Sprite.sprites[this.spriteIndex]?.on('animation', (animation: Animation) => { this._animation = animation })
        GameObject.gameObjects.push(this)
        this.trigger('load', this, true)
        if(Sprite.sprites[this.spriteIndex]?.type != SpriteType.DEFAULT){
            this._collider = new BoxCollider(position, size, this)
            this.on('position', () => {
                if(this.collider) this.collider.position = this.position
            })
            this.on('size', () => {
                if(this.collider) this.collider.size = this.size
            })
        }
    }

    public render(ctx: CanvasRenderingContext2D){
        if(this._visible){
            if(this._animation) this._spriteIndex = this._animation.activeSpriteIndex
            if(this._spriteIndex > -1) ctx.drawImage(Sprite.sprites[this._spriteIndex].sprite, this.position.x - Window.displayWidth / 2 - Camera.active.position.x, this.position.y - Window.displayHeight / 2 - Camera.active.position.y)
        }
    }

    public update(){
        this.collider?.update()
    }

    get spriteIndex(){
        return this._spriteIndex
    }
    
    set spriteIndex(spriteIndex: number){
        this._spriteIndex = spriteIndex
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

    get collider(){
        return this._collider
    }

    static getByType(type: GameObjectType){
        let rtn: Array<GameObject> = []
        for (let g = 0; g < GameObject.gameObjects.length; g++) {
            let gameObject = GameObject.gameObjects[g]
            if(gameObject.type == type) rtn.push(gameObject)
        }
        return rtn
    }

    public destroy(){
        GameObject.gameObjects.splice(GameObject.gameObjects.indexOf(this), 1)
    }
}