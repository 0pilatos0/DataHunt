import { BaseObject } from "./BaseObject.js"
import { Vector2 } from "./Vector2.js"

window.htmlObjects = []
window.htmlObjectTypes = ['Button', 'Div', 'InputField', 'List', 'Title'] //TODO <- make it dynamic

export class HTMLObject extends BaseObject{
    #element
    #visible

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} size 
     * @param {*} element 
     */
    constructor(position, size, element, parent = null){
        if(!position) position = new Vector2(0, 0)
        if(!size) size = new Vector2(0, 0)
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
        if(this.size.x) this.#element.style.width = `${this.size.x}`
        if(this.size.y) this.#element.style.height = `${this.size.y}`
        this.#element.style.left = `${this.position.x}`
        this.#element.style.top = `${this.position.y}`
        window.htmlObjects.push(this)
        //reloadHTMLObjectList()
        this.trigger('load')
    }

    set position(position){
        super.position(position)
        this.#element.style.left = `${this.position.x}`
        this.#element.style.top = `${this.position.y}`
    }


    set size(size){
        super.size(size)
        this.#element.style.width = `${this.size.x}`
        this.#element.style.height = `${this.size.y}`
    }

    set visible(visible){
        super.visible(visible)
        this.element.style.display = this.#visible ? "block" : "none"
    }

    get element(){
        return this.#element
    }
}