import { BaseObject } from "./BaseObject.js"
import { Sprite } from "./Sprite.js"
import { Vector2 } from "./Vector2.js"

window.gameObjects = []
window.gameObjectTypes = ['Player'] //TODO <- make it dynamic

export class GameObject extends BaseObject{
    #sprite
    #type
    
    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {Sprite} sprite 
     */
    constructor(position, size, sprite, type = 'normal') {
        super(position, size)
        this.#type = type
        this.#init(sprite)
    }

    #init = async (sprite) => {
        window.gameObjects.push(this)
        //reloadGameObjectList()
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

    colliding(gameObject){
        return (this.position.x < gameObject.position.x + gameObject.size.x &&
           this.position.x + this.size.x > gameObject.position.x &&
           this.position.y < gameObject.position.y + gameObject.size.y &&
           this.position.y + this.size.y > gameObject.position.y)
    }

    get type(){
        return this.#type
    }
}