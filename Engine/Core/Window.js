import { Rectangle } from "../Shapes/Rectangle.js"
import { Map } from "./Map.js"
import { Vector2 } from "./Vector2.js"

window.windows = []

export class Window{
    #canvas
    #size
    #ctx
    #elements = []
    #fps = 0
    #map

    /**
     * 
     * @param {Vector2} size 
     */
    constructor(size){
        this.#size = size
        this.#canvas = document.createElement('canvas')
        this.#ctx = this.#canvas.getContext('2d')
        window.windows.push(this)
        this.#map = new Map('testmap.json')
    }

    init(){
        return new Promise((resolve, reject) => {
            this.#resizeCanvas(this.#size)
            document.body.appendChild(this.#canvas)
            this.#canvas.style.position = "absolute"
            this.#canvas.style.zIndex = "100"
    
            //this.#elements.push(new Rectangle(new Vector2(100, 100), new Vector2(100, 100), '#00FFFF'))

            window.onresize = (e) => {
                this.#size = new Vector2(window.innerWidth, window.innerHeight)
                this.#resizeCanvas(this.#size)
            }
            setInterval(() => {
                console.log(this.#fps)
                this.#fps = 0
            }, 1000)
            return resolve(true)
        })
    }

    update(){
        for (let i = 0; i < this.#elements.length; i++) {
            this.#elements[i].update()
        }
        
    }

    render(){
        this.#ctx.clearRect(0, 0, this.#size.x, this.#size.y)

        this.#map.render()

        for (let i = 0; i < this.#elements.length; i++) {
            this.#elements[i].render(this.#ctx)
        }
        this.#fps++
    }

    /**
     * 
     * @param {Vector2} size 
     */
    #resizeCanvas = (size) => {
        this.#canvas.width = size.x
        this.#canvas.height = size.y
    }
}

