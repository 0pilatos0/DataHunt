import GameObject from "../Core/GameObject.js"
import { Vector2 } from "../Core/Vector2.js"

export class BaseShape extends GameObject{
    //#size
    //#position
    #color

    /**
     * @param {Vector2} position 
     * @param {Vector2} size
     * @param {String} color
     */
    constructor(position, size, color){
        super(position, size)
        //this.#position = position
        //this.#size = size
        this.#color = color
    }

    get size(){
        return super.size
    }
    
    /**
     * @param {Vector2} size 
     */
    set size(size){
        super.size = size
    }

    get position(){
        return super.position
    }

    /**
     * @param {Vector2} position 
     */
    set position(position){
        super.position = position
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