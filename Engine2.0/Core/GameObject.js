import { Sprite } from "./Sprite.js"
import { Vector2 } from "./Vector2.js"

window.gameObjects = []
window.gameObjectTypes = ['Player'] //TODO <- make it dynamic

export class GameObject{
    #position
    #size
    #sprite
    #positionCallback = () => { this.position = this.#position }
    #sizeCallback = () => { this.size = this.#size }

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {Sprite} sprite 
     */
    constructor(position, size, sprite) {
        this.#position = new Vector2(position.x, position.y, this.#positionCallback)
        this.#size = new Vector2(size.x, size.y, this.#sizeCallback)
        this.#init(sprite)
    }

    #init = async (sprite) => {
        window.gameObjects.push(this)
        reloadGameObjectList()
        this.#sprite = await sprite
    }

    set position(position){
        this.#position = new Vector2(position.x, position.y, this.#positionCallback)
    }

    get position(){
        return this.#position
    }

    set size(size){
        this.#size = new Vector2(size.x, size.y, this.#sizeCallback)
    }

    get size(){
        return this.#size
    }

    get sprite(){
        return this.#sprite
    }

    render(ctx){
        if(this.#sprite) ctx.drawImage(this.#sprite, this.#position.x - window.displayWidth / 2, this.#position.y - window.displayHeight / 2)
    }

    update(){

    }

    get json(){
        return {
            position: this.position,
            size: this.size,
            sprite: this.#sprite
        }
    }
}