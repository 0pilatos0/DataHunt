import { Vector2 } from "../Core/Vector2.js"

export class BaseShape{
    #size
    #position
    #color

    /**
     * @param {Vector2} position 
     * @param {Vector2} size
     * @param {String} color
     */
    constructor(position, size, color){
        this.#position = position
        this.#size = size
        this.#color = color
    }

    get size(){
        return this.#size
    }
    
    /**
     * @param {Vector2} size 
     */
    set size(size){
        this.#size.x = size.x
        this.#size.y = size.y
    }

    get position(){
        return this.#position
    }

    /**
     * @param {Vector2} position 
     */
    set position(position){
        this.#position.x = position.x
        this.#position.y = position.y
    }

    get color(){
        return this.#color
    }

    set color(color){
        this.#color = color
    }

    init(){

    }

    update(){

    }

    render(){
        
    }
}