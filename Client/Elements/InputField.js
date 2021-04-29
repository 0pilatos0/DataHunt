
import {BaseElement} from "./BaseElement.js"

window.inputFields = []

export class InputField extends BaseElement{
    constructor(position, size, name){
        super(position, size, name)
        this.element = init(this)
        window.inputFields.push(this)
    }
}

function init(instance){
    let element = document.createElement("input")
    element.style.width = `${instance.size.x}px`
    element.style.height = `${instance.size.y}px`
    element.style.position = "absolute"
    element.style.left = instance.position.x + "px"
    element.style.top = instance.position.y + "px"
    element.type = "text"
    element.name = instance.name
    elementHolder.appendChild(element)
    return element
}