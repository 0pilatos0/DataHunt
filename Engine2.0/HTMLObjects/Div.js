import { HTMLObject } from "../Core/HTMLObject.js";

export class Div extends HTMLObject{
    constructor(position, size, parent = null){
        super(position, size, document.createElement('div'), parent)
        this.#init()
    }

    #init = () => {

    }
}