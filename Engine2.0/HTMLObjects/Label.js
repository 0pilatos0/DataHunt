import { HTMLObject } from "../Core/HTMLObject.js";

export class Label extends HTMLObject{
    constructor(position, size, parent = null){
        super(position, size, document.createElement('label'), parent)
        this.#init()
    }

    #init = () => {

    }

    set text(text){
        this.element.innerText = text
    }
}