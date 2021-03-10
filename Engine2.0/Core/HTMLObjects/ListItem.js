import { HTMLObject } from "../HTMLObject.js";
import { Vector2 } from "../Vector2.js";

export class ListItem extends HTMLObject{
    constructor(text, parent = null){
        super(new Vector2(0, 0), new Vector2(0, 0), document.createElement('li'), parent)
        this.#init(text)
    }

    #init = (text) => {
        this.element.style.position = "relative"
        this.element.innerText = text
        this.element.style.width = "100%"
        this.element.style.height = "auto"
        this.element.style.listStyle = "none"
    }

    remove(){
        window.htmlObjects.splice(window.htmlObjects.indexOf(this), 1)
    }
}