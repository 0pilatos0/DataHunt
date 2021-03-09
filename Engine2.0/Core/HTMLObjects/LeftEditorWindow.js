import { HTMLObject } from "../HTMLObject.js";
import { Vector2 } from "../Vector2.js";
import { Div } from "./Div.js";
import { List } from "./List.js";

export class LeftEditorWindow extends HTMLObject{
    #dragging
    constructor(){
        super(new Vector2(`0px`, `0px`), new Vector2('calc(25% - 5px)', '100vh'), document.createElement('div'))
        this.#init()
    }

    #init = () => {
        this.element.style.background = "rgba(0, 255, 255, 0.329)"
        this.element.style.display = "absolute"
        this.element.style.zIndex = 10000
        this.element.style.minWidth = "250px"
        this.element.style.maxWidth = "50vw"
        let list = new List(new Vector2(0, 0), new Vector2(`100%`, `100%`), 'ul', this)
        setInterval(() => {
            list.removeAll()
            for (let i = 0; i < window.htmlObjects.length; i++) {
                list.addElement(htmlObjects[i].constructor.name)
            }
        }, 1000)

        let dragBar = new Div(new Vector2(0, 0), new Vector2(0, 0), this)

        this.#dragging = false

        dragBar.element.classList.add('dragBar')
        dragBar.element.style.left = `100%`

        dragBar.element.addEventListener('mousedown', (e) => {
            this.#dragging = true
        })

        dragBar.element.addEventListener('blur', () => {
            this.#dragging = false
        })

        document.body.addEventListener('mousemove', (e) => {
            if(this.#dragging) this.size = new Vector2(`${e.screenX}px`, this.size.y)
        })

        dragBar.element.addEventListener('mouseup', (e) => {
            this.#dragging = false
        })
    }
}