import { BaseObject } from "./BaseObject.js"
import { Sprite } from "./Sprite.js"
import { Vector2 } from "./Vector2.js"

window.gameObjects = []
window.gameObjectTypes = ['Player'] //TODO <- make it dynamic

export class GameObject extends BaseObject{
    #sprite
    
    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {Sprite} sprite 
     */
    constructor(position, size, sprite) {
        super(position, size)
        this.#init(sprite)
    }

    #init = async (sprite) => {
        window.gameObjects.push(this)
        reloadGameObjectList()
        this.#sprite = await sprite
    }

    get sprite(){
        return this.#sprite
    }

    render(ctx){
        super.render(ctx)
        if(this.#sprite) ctx.drawImage(this.#sprite, this.position.x - window.displayWidth / 2, this.position.y - window.displayHeight / 2)
    }

    get json(){
        let data = super.json
        data.sprite = this.#sprite
        return data
    }
}