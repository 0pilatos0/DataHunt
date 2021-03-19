import { BaseObject } from "./BaseObject.js"
import { Vector2 } from "./Vector2.js"

window.htmlObjects = []
window.htmlObjectTypes = ['Button', 'Div', 'InputField', 'List', 'Title'] //TODO <- make it dynamic

export class HTMLObject extends BaseObject{
    #element
    #visible
    #positionCallback = () => { this.position = this.#position }
    #sizeCallback = () => { this.size = this.#size }

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {*} element 
     */
    constructor(position, size, element, parent = null){
        super(position, size)
        this.#element = element
        this.#visible = true
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
        if(this.size.x) this.#element.style.width = `${this.#size.x}px`
        if(this.size.y) this.#element.style.height = `${this.#size.y}px`
        this.#element.style.left = `${this.position.x}px`
        this.#element.style.top = `${this.position.y}px`
        window.htmlObjects.push(this)
        reloadHTMLObjectList()
    }

    set position(position){
        super.position(position)
        this.#element.style.left = `${this.position.x}px`
        this.#element.style.top = `${this.position.y}px`
    }


    set size(size){
        super.size(size)
        this.#element.style.width = `${this.size.x}px`
        this.#element.style.height = `${this.size.y}px`
    }

    set visible(visible){
        super.visible(visible)
        this.element.style.display = this.#visible ? "block" : "none"
    }

    get element(){
        return this.#element
    }
}