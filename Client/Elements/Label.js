
import {BaseElement} from "./BaseElement.js"

window.labels = []

export class Label extends BaseElement{
    #text

    constructor(position, size, name, text){
        super(position, size, name)
        this.#text = text
        this.element = init(this)
        window.labels.push(this)
    }

    set text(text){
        this.#text = text
        this.element.innerHTML = text
    }

    get text(){
        return this.#text;
    }
}

function init(instance){
    let element = document.createElement("label")
    element.style.width = `${instance.size.x}px`
    element.style.height = `${instance.size.y}px`
    element.style.position = "absolute"
    element.style.left = instance.position.x + "px"
    element.style.top = instance.position.y + "px"
    element.style.color = "#FFFFFF"
    element.name = instance.name
    element.innerHTML = instance.text
    elementHolder.appendChild(element)
    return element
}