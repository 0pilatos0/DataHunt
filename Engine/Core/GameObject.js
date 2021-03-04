import { Vector2 } from "./Vector2.js"

export default class GameObject{
    #position
    #size
    #renderPosition
    #bounds

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     */
    constructor(position, size){
        this.#position = position //center of element
        this.#renderPosition = new Vector2(position.x - size.x / 2, position.y - size.y / 2) //top left of element
        this.#size = size
        this.#bounds = this.#createBounds()
    }

    /**
     * @param {Vector2} position
     */
    set position(position){
        this.#position = position
        this.#renderPosition = new Vector2(this.#position.x - this.#size.x / 2, this.#position.y - this.#size.y / 2)
        this.#bounds = this.#createBounds()
    }

    get position(){
        return this.#position
    }

    /**
     * @param {Vector2} size
     */
    set size(size){
        this.#size = size
        this.#renderPosition = new Vector2(this.#position.x - this.#size.x / 2, this.#position.y - this.#size.y / 2)
        this.#bounds = this.#createBounds()
    }

    get size(){
        return this.#size
    }

    get renderPosition(){
        return this.#renderPosition
    }

    #createBounds = () => {
        return {
            left: this.#position.x - this.#size.x / 2,
            top: this.#position.y - this.#size.y / 2,
            right: this.#position.x + this.#size.x / 2,
            bottom: this.#position.y + this.#size.y / 2
        }
    }
}