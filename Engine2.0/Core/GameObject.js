import { Sprite } from "./Sprite.js"

window.gameObjects = []

export class GameObject{
    #position
    #size
    #sprite

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {Sprite} sprite 
     */
    constructor(position, size, sprite) {
        this.#position = new Vector2(position.x, position.y, () => {
            this.position = this.#position
        })
        this.#size = new Vector2(size.x, size.y, () => {
            this.size = this.#size
        })
        this.#sprite = sprite
    }

    set position(position){
        this.#position = position
    }

    get position(){
        return this.#position
    }

    set size(size){
        this.#size = size
    }

    get size(){
        return this.#size
    }

    render(ctx){
        ctx.drawImage(sprite, this.#position.x - window.spriteSize / 2 - window.displayWidth / 2, this.#position.y - window.spriteSize / 2 - window.displayHeight / 2)
    }

    update(){

    }
}