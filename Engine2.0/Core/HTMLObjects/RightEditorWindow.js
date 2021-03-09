import { HTMLObject } from "../HTMLObject.js";
import { Vector2 } from "../Vector2.js";
import { Div } from "./Div.js";

export class RightEditorWindow extends HTMLObject{
    #dragging
    constructor(){
        super(new Vector2(`calc(75vw + 5px)`, `0px`), new Vector2(`calc(25% - 5px)`, `100vh`), document.createElement('div'))
        this.#init()
    }

    #init = () => {
        this.element.style.background = "rgba(255, 0, 255, 0.329)"
        this.element.style.display = "absolute"
        this.element.style.zIndex = 10000
        this.element.style.minWidth = "250px"
        this.element.style.maxWidth = "50vw"

        let dragBar = new Div(new Vector2(0, 0), new Vector2(0, 0), this)

        this.#dragging = false

        dragBar.element.classList.add('dragBar')
        dragBar.element.style.right = `100%`

        dragBar.element.addEventListener('mousedown', (e) => {
            this.#dragging = true
        })

        dragBar.element.addEventListener('blur', () => {
            this.#dragging = false
        })

        document.body.addEventListener('mousemove', (e) => {
            if(this.#dragging && e.screenX - 5 >= window.innerWidth / 2 && e.screenX - 5 <= window.innerWidth - 250){
                this.position = new Vector2(`${e.screenX}px`, this.position.y)
                this.size = new Vector2(`${window.innerWidth - e.screenX}px`, this.size.y)
            }
        })

        dragBar.element.addEventListener('mouseup', (e) => {
            this.#dragging = false
        })
    }
}