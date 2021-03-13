import { Sprite } from "./Sprite.js"
import { Vector2 } from "./Vector2.js"

window.gameObjects = []

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
        this.#sprite = sprite
        this.#init()
    }

    #init = () => {
        window.gameObjects.push(this)
        reloadGameObjectList()
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

    render(ctx){
        ctx.drawImage(sprite, this.#position.x - window.spriteSize / 2 - window.displayWidth / 2, this.#position.y - window.spriteSize / 2 - window.displayHeight / 2)
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