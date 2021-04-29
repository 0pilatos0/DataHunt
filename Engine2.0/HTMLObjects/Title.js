import { HTMLObject } from "../Core/HTMLObject.js";

export class Title extends HTMLObject{
    constructor(position, size, parent = null){
        super(position, size, document.createElement('h1'), parent)
        this.#init()
    }

    #init = () => {
        
    }
}