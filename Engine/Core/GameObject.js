import { Sprite } from "./Sprite.js"
import { Vector2 } from "./Vector2.js"

export default class GameObject{
    #position
    #size
    #sprite

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {Sprite} sprite
     */
    constructor(position, size, path){
        this.#position = position
        this.#size = size
        this.#sprite = new Sprite(path)
        this.#init()
    }

    #init = async () => {
        await this.#sprite.init()
        this.#sprite = this.#sprite.get()
        console.log("?")
    }

    get sprite(){
        if(typeof this.#sprite == 'canvas') return this.#sprite
    }

    /**
     * @param {Vector2} position
     */
    set position(position){
        this.#position = position
        //this.#renderPosition = new Vector2(this.#position.x - this.#size.x / 2, this.#position.y - this.#size.y / 2)
    }

    get position(){
        return this.#position
    }

    /**
     * @param {Vector2} size
     */
    set size(size){
        this.#size = size
        //this.#renderPosition = new Vector2(this.#position.x - this.#size.x / 2, this.#position.y - this.#size.y / 2)
    }

    get size(){
        return this.#size
    }

    get bounds(){
        return {
            left: this.#position.x,
            top: this.#position.y,
            right: this.#position.x + this.#size.x,
            bottom: this.#position.y + this.#size.y,
        }
    }

    // get renderPosition(){
    //     return this.#renderPosition
    // }
}