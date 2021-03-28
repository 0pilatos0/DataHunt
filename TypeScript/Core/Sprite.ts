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

    constructor(path: string, size?: Vector2, data?: any){
        super()
        this.init(path, size, data)
    }

    private init(path: string, size?: Vector2, data?: any){
        let img = new Image()
        img.onload = () => {
            if(!size) size = new Vector2(window.spriteSize, window.spriteSize)
            let canvas = new Canvas(new Vector2(size.x, size.y))
            canvas.ctx.drawImage(img, 0, 0, size.x, size.y)
            this._sprite = canvas.element
            this.trigger('load', this)
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
                window.map.on('load', () => {
                    let animation = new Animation()
                    for (let a = 0; a < data?.animation.length; a++) {
                        let anim = data.animation[a]
                        animation.addSprite(Tileset.tiles[anim.tileid], anim.duration)
                    }
                    animation.on('change', (sprite: Sprite) => {
                        this._sprite = sprite.sprite
                    })
                })
            }
        }
        img.src = path
    }

    get sprite(){
        return this._sprite
    }

    get type(){
        return this._type
    }
}