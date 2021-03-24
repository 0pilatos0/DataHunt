import { Events } from "./Event.js"

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
    constructor(path, data = null){
        super()
        this.#init(path, data)
    }

    #init = async (path, data) => {
        //TODO fix scaling sprites
        new CustomImage(path).on('load', (img) => {
            let canvas = document.createElement('canvas')
            canvas.width = window.spriteSize
            canvas.height = window.spriteSize
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, window.spriteSize, window.spriteSize)
            this.#sprite = canvas
            for (let i = 0; i < data?.properties?.length; i++) {
                if(data.properties[i].name == 'name' && data.properties[i].type == 'string'){
                    this.#name = data.properties[i].value
                }
            }
            if(data?.type) this.#type = data.type
            this.trigger('load')
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
}