window.sprites = []

export class Sprite{
    #index

    constructor(path){
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let img = new Image()
        img.src = path
        this.init(img, canvas, ctx)
    }

    async init(img, canvas, ctx){
        await this.#loadImage(img)
        ctx.drawImage(img, 0, 0, window.spriteSize, window.spriteSize)
        window.sprites.push(canvas)
        this.#index = window.sprites.indexOf(canvas)
    }

    #loadImage = (img) => {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                return resolve(true)
            }
            img.onerror = () => {
                return resolve(false)
            }
        })
    }

    get(){
        return window.sprites[this.#index] || new Image()
    }
}