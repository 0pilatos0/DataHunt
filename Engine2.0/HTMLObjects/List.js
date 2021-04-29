import { HTMLObject } from "../Core/HTMLObject.js";
import { ListItem } from "./ListItem.js";

export class List extends HTMLObject{
    #listItems = []
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
        for (let i = 0; i < this.#listItems.length; i++) {
            this.#listItems[i].remove()
            this.#listItems.splice(i, 1)
        }
        this.element.innerHTML = ""
    }

    addElement(text){
        this.#listItems.push(new ListItem(text, this))
    }

    items(i){
        console.log(i)
        console.log(this.#listItems[this.#listItems.indexOf(i)])
        return this.#listItems[this.#listItems.indexOf(i)]
    }
}