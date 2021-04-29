import Animation from "./Animation.js";
import Camera from "./Camera.js";
import Collider from "./Collider.js";
import BoxCollider from "./Colliders/BoxCollider.js";
import AnimationState from "./Enums/AnimationState.js";
import ColliderType from "./Enums/ColliderType.js";
import GameObjectType from "./Enums/GameObjectType.js";
import Sprite from "./Sprite.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";

export default class GameObject extends Transform{
    public static gameObjects: Array<GameObject> = []

    private _type: GameObjectType
    private _spriteIndex: number = -1
    private _collider: Collider | null = null
    private _visible: boolean
    private _animation: Animation | null = null

    constructor(position: Vector2, size: Vector2, data: any = undefined, type: GameObjectType = GameObjectType.DEFAULT){
        super(position, size)
        this._type = type
        if(data){
            this._spriteIndex = data.id
            if(data.animation){
                this._animation = new Animation()
                data.animation.map((a: any) => {
                    this._animation?.add(Tileset.tiles[a.id], a.duration)
                })
            }
            if(data.type){
                let type: ColliderType = ColliderType.DEFAULT
                switch (data.type) {
                    case "Collidable":
                        type = ColliderType.COLLIDABLE
                        break
                    case "Interactable":
                        type = ColliderType.INTERACTABLE
                        break
                    default:
                        break
                }
                this._collider = new BoxCollider(new Vector2(position.x + data.colliderOffset.x, position.y + data.colliderOffset.y) || position, new Vector2(size.x + data.colliderSize.x, size.y + data.colliderSize.y) || size, this, type)
            }
        }
        this._visible = false
        GameObject.gameObjects.push(this)
        this.trigger('load', this, true)
    }

    public render(ctx: CanvasRenderingContext2D){
        if(this._visible){
            if(this._animation) this._spriteIndex = this._animation.activeSpriteIndex
            if(this._spriteIndex > -1) ctx.drawImage(Sprite.sprites[this._spriteIndex].sprite, this.position.x, this.position.y)//ctx.drawImage(Sprite.sprites[this._spriteIndex].sprite, this.position.x - Window.displayWidth / 2 - Camera.active.position.x, this.position.y - Window.displayHeight / 2 - Camera.active.position.y)
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

    public get visible(){
        return this._visible
    }

    public set visible(visible){
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

    public static getByType(type: GameObjectType){
        let rtn: Array<GameObject> = []
        GameObject.gameObjects.map(g => {
            if(g.type == type) rtn.push(g)
        })
        return rtn
    }

    public destroy(){
        GameObject.gameObjects.splice(GameObject.gameObjects.indexOf(this), 1)
    }
}