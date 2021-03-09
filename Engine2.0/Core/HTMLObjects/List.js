import { HTMLObject } from "../HTMLObject.js";

export class List extends HTMLObject{
    constructor(position, size, type, parent = null){
        super(position, size, document.createElement(type), parent)
        this.#init()
    }

    #init = () => {
        this.element.style.margin = "0"
        this.element.style.paddingLeft = "0"
        this.element.style.maxHeight = "100%"
        this.element.style.overflowY = "scroll"
    }

    removeAll(){
        this.element.innerHTML = ""
    }

    addElement(text){
        let item = document.createElement('li')
        this.element.appendChild(item)
        item.innerText = text
        item.style.width = "100%"
        item.style.height = "auto"
        item.style.listStyle = "none"
    }
}