import { Events } from "./Event.js"
import { Vector2 } from "./Vector2.js"

export class CustomImage extends Events{
    constructor(path){
        super()
        this.#init(path)
    }

    #init = (path) => {
        let img = new Image()
        img.onload = () => {
            this.trigger('load', img)
        }
        img.onerror = () => {
            return
        }
        img.src = path
    }
}

export class Sprite extends Events{
    #sprite
    #name
    #type
    #animation = []
    constructor(path, data = null){
        super()
        this.#init(path, data)
    }

    #init = async (path, data) => {
        new CustomImage(path).on('load', (img) => {
            let canvas = document.createElement('canvas')
            canvas.width = window.spriteSize
            canvas.height = window.spriteSize
            let ctx = canvas.getContext('2d')
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(img, 0, 0, window.spriteSize, window.spriteSize)
            this.#sprite = canvas
            for (let i = 0; i < data?.properties?.length; i++) {
                if(data.properties[i].name == 'name' && data.properties[i].type == 'string'){
                    this.#name = data.properties[i].value
                }
            }
            window.map.on('load', () => {
                for (let i = 0; i < data?.animation?.length; i++) {
                    this.#animation.push({sprite:window.tiles[data.animation[i].tileid + data.tileOffset].sprite,duration:data.animation[i].duration})
                }
                let totalDuration = 0
                this.#animation.map(a => {totalDuration += a.duration})
                setInterval(() => {
                    for (let i = 0; i < this.#animation.length; i++) {
                        setTimeout(() => {
                            this.#sprite = this.#animation[i]?.sprite
                        }, this.#animation[i].duration * i);
                    }
                }, totalDuration);
            })
            if(data?.type) this.#type = data.type
            this.trigger('load', this)
        })
    }

    get name(){
        return this.#name
    }

    get sprite(){
        return this.#sprite
    }

    get type(){
        return this.#type
    }

    get animation(){
        return this.#animation
    }
}

export class Animation extends Events{
    #currentSprite

    constructor(sprites, intervalInMS){
        super()
        this.#init(sprites, intervalInMS)
    }

    #init = (sprites, intervalInMS) => {
        setInterval(() => {
            for (let i = 0; i < sprites.length; i++) {
                setTimeout(() => {
                    this.#currentSprite = sprites[i]
                    this.trigger('change', this)
                }, intervalInMS * i);
            }
        }, intervalInMS * sprites.length);
        setTimeout(() => {
            this.trigger('load', this) 
        }, 100);
    }

    get currentSprite(){
        return this.#currentSprite
    }
}

export function tilesetToSprites(path, size = new Vector2(32, 32)){
    return new Promise(async (resolve, reject) => {
        new CustomImage(path).on('load', (img) => {
            let amount = 0
            let tileColumns = img.width / size.x
            let tileRows = img.height / size.y
            let totalSprites = tileColumns * tileRows
            let sprites = []
            for (let y = 0; y < tileRows; y++) {
                sprites.push(new Array)
                for (let x = 0; x < tileColumns; x++) {
                    let tileCanvas = document.createElement('canvas')
                    let tileContext = tileCanvas.getContext('2d')
                    tileCanvas.width = size.x
                    tileCanvas.height = size.y
                    tileContext.drawImage(img, -x * size.x, -y * size.y)
                    new Sprite(tileCanvas.toDataURL('image/png')).on('load', (sprite) => {
                        sprites[y].push(sprite)
                        amount++
                        if(amount == totalSprites) {return resolve(sprites)}
                    })
                }
            }
        })
    })
}