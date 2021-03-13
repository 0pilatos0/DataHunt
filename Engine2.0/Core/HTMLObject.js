import { Vector2 } from "./Vector2.js"

window.htmlObjects = []
window.htmlObjectTypes = ['Button', 'Div', 'InputField', 'List', 'Title'] //<- make it dynamic

export class HTMLObject{
    #position
    #size
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
        this.#position = new Vector2(position.x, position.y, this.#positionCallback)
        this.#size = new Vector2(size.x, size.y, this.#sizeCallback)
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
        if(this.#size.x) this.#element.style.width = `${this.#size.x}px`
        if(this.#size.y) this.#element.style.height = `${this.#size.y}px`
        this.#element.style.left = `${this.#position.x}px`
        this.#element.style.top = `${this.#position.y}px`
        window.htmlObjects.push(this)
        reloadHTMLObjectList()
    }

    set position(position){
        this.#position = new Vector2(position.x, position.y, this.#positionCallback)
        this.#element.style.left = `${this.#position.x}px`
        this.#element.style.top = `${this.#position.y}px`
    }

    get position(){
        return this.#position
    }

    set size(size){
        this.#size = new Vector2(size.x, size.y, this.#sizeCallback)
        this.#element.style.width = `${this.#size.x}px`
        this.#element.style.height = `${this.#size.y}px`
    }

    get size(){
        return this.#size
    }

    set visible(visible){
        this.#visible = visible
        this.element.style.display = this.#visible ? "block" : "none"
    }

    get visible(){
        return this.#visible
    }

    get element(){
        return this.#element
    }

    get json(){
        return {
            position: this.position,
            size: this.size,
            visible: this.visible
        }
    }

    update(){
        
    }

    render(){
        
    }
}