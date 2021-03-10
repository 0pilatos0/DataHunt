import { Vector2 } from "./Vector2.js"

window.htmlObjects = []

export class HTMLObject{
    #position
    #size
    #element
    #visible

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {*} element 
     */
    constructor(position, size, element, parent = null){
        this.#position = position
        this.#size = size
        this.#element = element
        this.#init(parent)
    }

    #init = (parent) => {
        if(parent){
            if(parent.element){
                parent.element.appendChild(this.#element)
            }
            else{
                parent.appendChild(this.#element)
            }
        } 
        else{
            document.body.appendChild(this.#element)
        }
        this.#element.style.position = "absolute"
        if(this.#size.x) this.#element.style.width = `${this.#size.x}`
        if(this.#size.y) this.#element.style.height = `${this.#size.y}`
        this.#element.style.left = `${this.#position.x}`
        this.#element.style.top = `${this.#position.y}`
        window.htmlObjects.push(this)
    }

    set position(position){
        this.#position = position
        this.#element.style.left = `${this.#position.x}`
        this.#element.style.top = `${this.#position.y}`
    }

    get position(){
        return this.#position
    }

    set size(size){
        this.#size = size
        this.#element.style.width = `${this.#size.x}`
        this.#element.style.height = `${this.#size.y}`
    }

    get size(){
        return this.#size
    }

    set visible(visible){
        this.#visible = visible
    }

    get visible(){
        return this.#visible
    }

    get element(){
        return this.#element
    }
}