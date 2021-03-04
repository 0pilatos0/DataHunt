import { Rectangle } from "../Shapes/Rectangle.js"
import { Map } from "./Map.js"
import { Vector2 } from "./Vector2.js"

window.windows = []

export class Window{
    #canvas
    #ctx
    #elements = []
    #fps = 0
    #bounds
    #map
    #x
    #y

    //{
    // renderPos: new Vector2(16, 16),
    // pos: new Vector2(0, 0),
    // size: new Vector2(window.spriteSize, window.spriteSize)
    // bounds: 
    //}
    
    constructor(){
        this.#canvas = document.createElement('canvas')
        this.#ctx = this.#canvas.getContext('2d')
        window.windows.push(this)
        this.#map = new Map('testmap.json')
    }

    init(){
        return new Promise((resolve, reject) => {
            this.#x = 0
            this.#y = 0
            this.#resize()
            document.body.appendChild(this.#canvas)
            this.#canvas.style.position = "absolute"
            this.#canvas.style.zIndex = "100"
    
            this.#elements.push(new Rectangle(new Vector2(0, 0), new Vector2(window.spriteSize, window.spriteSize), '#00FFFF'))

            window.onresize = (e) => {
                this.#resize()
            }
            setInterval(() => {
                console.log(this.#fps)
                this.#fps = 0
                this.#x += 100
                this.#y += 100
                this.#elements[0].position = new Vector2(this.#x, this.#y)
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
        //this.#ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

        this.#map.render(this.#elements[0].position)

        for (let i = 0; i < this.#elements.length; i++) {
            //this.#elements[i].render(this.#ctx)
        }
        this.#fps++
    }

    #resize = () => {
        let scaleFitNative = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)//, 

        this.#canvas.width = window.innerWidth
        this.#canvas.height = window.innerHeight

        this.#ctx.setTransform(scaleFitNative, 0, 0, scaleFitNative, Math.floor(window.innerWidth/2), Math.floor(window.innerHeight/2))
        
        this.#ctx.imageSmoothingEnabled = scaleFitNative < 1 ?  true : false

        this.#bounds = this.#recreateBounds()

        this.#map.resize()

        //deviceDisplayWidth = window.innerWidth/scaleFitNative, 
        //deviceDisplayHeight = window.innerHeight/scaleFitNative 
        //window.maxTilesX = Math.ceil(deviceDisplayWidth/window.spriteSize)+2
        //window.maxTilesY = Math.ceil(deviceDisplayHeight/window.spriteSize)+2
    }

    #recreateBounds = () => {
        return {
            top: -window.innerHeight / 2,
            left: -window.innerWidth / 2,
            bottom: window.innerHeight /  2,
            right: window.innerWidth / 2
        }
    }
}

