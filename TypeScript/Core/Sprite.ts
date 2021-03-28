import Animation from "./Animation.js";
import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Tileset from "./Tileset.js";
import Vector2 from "./Vector2.js";
declare var window: any

export const enum SpriteType{
    DEFAULT,
    COLLIDABLE,
    INTERACTABLE
}

export default class Sprite extends Event{
    private _sprite: HTMLCanvasElement = document.createElement('canvas')
    private _type: SpriteType = SpriteType.DEFAULT
    private _animation: Animation | null = null

    constructor(path: string, size?: Vector2, data?: any, tileset?: Tileset){
        super()
        this.init(path, size, data, tileset)
    }

    private init(path: string, size?: Vector2, data?: any, tileset?: Tileset){
        let img = new Image()
        img.onload = () => {
            if(!size) size = new Vector2(window.spriteSize, window.spriteSize)
            let canvas = new Canvas(new Vector2(size.x, size.y))
            canvas.ctx.drawImage(img, 0, 0, size.x, size.y)
            this._sprite = canvas.element
            //console.log(data)
            switch (data?.type) {
                case "Collidable":
                    this._type = SpriteType.COLLIDABLE
                    break;
                case "Interactable":
                    this._type = SpriteType.INTERACTABLE
                    break;
                default:
                    this._type = SpriteType.DEFAULT
                    break;
            }
            if(data?.animation){
                tileset?.on('load', () => {
                    this._animation = new Animation()
                    for (let a = 0; a < data?.animation.length; a++) {
                        this._animation.add(tileset.tiles[data.animation[a].tileid], data.animation[a].duration)
                    }
                    this.trigger('animation', this._animation)
                    //TODO findout why animations aren't working inside here...
                })
            }
            this.trigger('load', this)
        }
        img.src = path
    }

    get sprite(){
        return this._sprite
    }

    get type(){
        return this._type
    }

    get animation(){
        return this._animation
    }
}