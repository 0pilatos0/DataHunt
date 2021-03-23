export async function Sprite(path, data = null){
    return new Promise(async (resolve, reject) => {
        let img = await CustomImage(path)
        let canvas = document.createElement('canvas')
        
        canvas.width = window.spriteSize
        canvas.height = window.spriteSize
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, window.spriteSize, window.spriteSize)
        return resolve(new CustomSprite(canvas, data))
    })
}

export async function CustomImage(path){
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => {
            return resolve(img)
        }
        img.onerror = () => {
            return resolve(false)
        }
        img.src = path
    })
}

class CustomSprite{
    #sprite
    #name
    #type
    constructor(sprite, data = null){
        this.#sprite = sprite
        this.#init(data)
    }

    #init = (data) => {
        for (let i = 0; i < data?.properties?.length; i++) {
            if(data.properties[i].name == 'name' && data.properties[i].type == 'string'){
                this.#name = data.properties[i].value
            }
        }
        if(data?.type) this.#type = data.type
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