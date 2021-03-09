import { HTMLObject } from "../HTMLObject.js";

export class Title extends HTMLObject{
    constructor(position, size){
        super(position, size, document.createElement('h1'))
        this.#init()
    }

    #init = () => {
        
    }
}