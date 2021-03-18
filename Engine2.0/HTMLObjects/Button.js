import { HTMLObject } from "../Core/HTMLObject.js";

export class Button extends HTMLObject{
    constructor(position, size, parent = null){
        super(position, size, document.createElement('button'), parent)
        this.#init()
    }

    #init = () => {
        this.element.addEventListener('click', () => {
            
        })
    }
}