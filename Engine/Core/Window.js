import { Rectangle } from "../Shapes/Rectangle.js"
import { Map } from "./Map.js"
import { Vector2 } from "./Vector2.js"

window.windows = []

export class Window{
    #canvas
    #ctx
    #elements = []
    #bounds
    #map
    #x
    #y

    constructor(){
        this.#canvas = document.createElement('canvas')
        this.#ctx = this.#canvas.getContext('2d')
        window.windows.push(this)
        this.#map = new Map('testmap.json')
        this.playerPos = new Vector2(0, 0)
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
                this.playerPos.x += 0.2
                this.playerPos.y += 0.2
                this.#elements[0].position = this.playerPos
            }, 100)
            return resolve(true)
        })
    }

    update(){
        this.#map.update(this.playerPos)
        for (let i = 0; i < this.#elements.length; i++) {
            this.#elements[i].update()
        }
    }

    render(){
        this.#ctx.clearRect(-window.innerWidth, -window.innerHeight, window.innerWidth * 2, window.innerHeight * 2)

        this.#map.render(this.#ctx)

        for (let i = 0; i < this.#elements.length; i++) {
            this.#elements[i].render(this.#ctx)
        }
    }

    #resize = () => {
        

        this.#canvas.width = window.innerWidth
        this.#canvas.height = window.innerHeight

        

        let scaleFitNative = Math.min(window.innerWidth / 1920, window.innerHeight / 1080) 

        window.deviceDisplayWidth = window.innerWidth/scaleFitNative
        window.deviceDisplayHeight = window.innerHeight/scaleFitNative 

        this.#ctx.setTransform(scaleFitNative, 0, 0, scaleFitNative, Math.floor(window.innerWidth/2), Math.floor(window.innerHeight/2))
        
        this.#ctx.imageSmoothingEnabled = scaleFitNative < 1 ?  true : false

        this.#bounds = this.#recreateBounds()

        //this.#map.resize()

       
        

        
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

