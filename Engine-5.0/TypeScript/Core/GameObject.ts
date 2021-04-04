import Animation from "./Animation.js";
import Collider from "./Collider.js";
import BoxCollider from "./Colliders/BoxCollider.js";
import AnimationState from "./Enums/AnimationState.js";
import ColliderType from "./Enums/ColliderType.js";
import GameObjectType from "./Enums/GameObjectType.js";
import Sprite from "./Sprite.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class GameObject extends Transform{
    public static gameObjects: Array<GameObject> = []

    private _type: GameObjectType = GameObjectType.DEFAULT
    private _spriteIndex: number = -1
    private _collider: Collider | null = null
    private _visible: boolean = false
    private _animation: Animation | null = null
    private _layer: number = 0
    
    constructor(position: Vector2, size: Vector2, data: any = undefined, type: GameObjectType = GameObjectType.DEFAULT, keepTrying: boolean = false){
        super(position, size)
        this._type = type
        if(data){
            this._spriteIndex = data.id
            if(data.animation){
                this._animation = new Animation()
                data.animation.map((a: any) => { this._animation?.add(Tileset.tiles[a.id].id, a.duration) })
            }
            if(data.colliderType){
                let type: ColliderType = ColliderType.DEFAULT
                switch (data.colliderType) {
                    case "Collidable":
                        type = ColliderType.COLLIDABLE
                        break
                    case "Interactable":
                        type = ColliderType.INTERACTABLE
                        break
                    default:
                        break
                }
                let pos = data.colliderOffset ? new Vector2(position.x + (data.colliderOffset.x * Window.active.spriteScaleFactor), position.y + (data.colliderOffset.y * Window.active.spriteScaleFactor)) : new Vector2(position.x, position.y)
                let si = data.colliderSize ? new Vector2(data.colliderSize.x * Window.active.spriteScaleFactor, data.colliderSize.y * Window.active.spriteScaleFactor) : new Vector2(size.x, size.y)
                this._collider = new BoxCollider(pos, si, GameObject.gameObjects.indexOf(this), type)
                this.on('position', () => {
                    if(this.collider) this.collider.position = this.position
                })
                this.on('size', () => {
                    if(this.collider) this.collider.size = this.size
                })
            }
        }
        GameObject.gameObjects.push(this)
        this.trigger('load', this, keepTrying)
    }

    public render(ctx: CanvasRenderingContext2D | null){
        if(this._visible && ctx){
            if(this._animation) this._spriteIndex = this._animation.activeSpriteIndex
            if(this._spriteIndex > -1) ctx.drawImage(Sprite.sprites[this._spriteIndex].sprite, this.position.x - Window.active.displaySize.x / 2 - Window.active.scene.camera.position.x, this.position.y - Window.active.displaySize.y / 2 - Window.active.scene.camera.position.y)
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

    set collider(collider){
        this._collider = collider
        this.on('position', () => {
            if(this.collider) this.collider.position = this.position
        })
        this.on('size', () => {
            if(this.collider) this.collider.size = this.size
        })
    }

    get type(){
        return this._type
    }

    get collider(){
        return this._collider
    }

    set layer(layer: number){
        this._layer = layer
    }

    get layer(){
        return this._layer
    }

    public static getByType(type: GameObjectType){
        let rtn: Array<GameObject> = []
        GameObject.gameObjects.map(g => {
            if(g.type == type) rtn.push(g)
        })
        return rtn
    }

    public static get sortByLayer(){
        return GameObject.gameObjects.sort((a, b) => (a.layer > b.layer) ? 1 : -1)
    }

    public destroy(){
        GameObject.gameObjects.splice(GameObject.gameObjects.indexOf(this), 1)
    }
}