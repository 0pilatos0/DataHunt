import { Sprite } from "./Sprite.js"

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
        this.#position = position
        this.#size = size
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

    draw(ctx){
        ctx.drawImage(sprite, this.#position.x - window.spriteSize / 2 - window.displayWidth / 2, this.#position.y - window.spriteSize / 2 - window.displayHeight / 2)
    }

    update(){

    }
}