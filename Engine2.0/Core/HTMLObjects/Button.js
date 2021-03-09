import { HTMLObject } from "../HTMLObject.js";

export class Button extends HTMLObject{
    constructor(position, size){
        super(position, size, document.createElement('button'))
        this.#init()
    }

    #init = () => {
        this.element.addEventListener('click', () => {
            
        })
    }
}