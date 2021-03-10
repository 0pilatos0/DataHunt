import { HTMLObject } from "../HTMLObject.js";
import { Vector2 } from "../Vector2.js";
import { Div } from "./Div.js";
import { List } from "./List.js";
import { Button } from "./Button.js";

export class LeftEditorWindow{
    constructor(){
        this.#init()
    }

    #init = () => {
        let list = new List(new Vector2(0, 0), new Vector2(`100%`, `100%`), 'ul', editorLeft)
        setInterval(() => {
            list.removeAll()

            for (let i = 0; i < window.htmlObjects?.length; i++) {
                if(window.htmlObjects[i] != list && window.htmlObjects[i].constructor.name != "ListItem") list.addElement(window.htmlObjects[i].constructor.name)
            }
            for (let i = 0; i < window.gameObjects?.length; i++) {
                list.addElement(window.gameObjects[i].constructor.name)
            }
            
        }, 1000)
    }
}