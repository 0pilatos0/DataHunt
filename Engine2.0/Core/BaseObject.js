import { Vector2 } from "./Vector2.js"

export class BaseObject{
    #position
    #size
    #visible = true
    #positionCallback = () => { this.position = this.#position }
    #sizeCallback = () => { this.size = this.#size }

    constructor(position, size){
        this.#position =  new Vector2(position.x, position.y, this.#positionCallback)
        this.#size = new Vector2(size.x, size.y, this.#sizeCallback)
        //TODO create some sort of event when changing x and y vector2
    }

    set size(size){
        this.#size = new Vector2(size.x, size.y, this.#sizeCallback)
    }

    get size(){
        return this.#size
    }

    set position(position){
        this.#position = new Vector2(position.x, position.y, this.#positionCallback)
    }

    get position(){
        return this.#position
    }

    set visible(visible){
        this.#visible = visible
    }

    get visible(){
        return this.#visible
    }

    get json(){
        return {
            position: this.position,
            size: this.size,
            visible: this.visible
        }
    }

    render(){

    }

    update(){

    }
}