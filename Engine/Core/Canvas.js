export class Canvas{
    #canvas
    #ctx

    constructor(){
        this.#init()
    }

    #init = () => {
        this.#canvas = document.createElement('canvas')
        this.#ctx = this.#canvas.getContext('2d')
        this.#resize()
        window.addEventListener('resize', this.#resize)
        document.body.appendChild(this.#canvas)
    }

    #resize = () => {
        this.#ctx.clearRect(-window.innerWidth, -window.innerHeight, window.innerWidth * 2, window.innerHeight * 2)

        this.#canvas.width = window.innerWidth
        this.#canvas.height = window.innerHeight
    
        let scaleFitNative = Math.min(window.innerWidth / 1920, window.innerHeight / 1080) 

        window.deviceDisplayWidth = window.innerWidth/scaleFitNative
        window.deviceDisplayHeight = window.innerHeight/scaleFitNative 

        this.#ctx.setTransform(scaleFitNative, 0, 0, scaleFitNative, Math.floor(window.innerWidth/2), Math.floor(window.innerHeight/2))
        this.#ctx.imageSmoothingEnabled = scaleFitNative < 1

        window.maxTilesX = Math.ceil(window.deviceDisplayWidth/window.spriteSize)
        window.maxTilesY = Math.ceil(window.deviceDisplayHeight/window.spriteSize)
    }

    clear(){
        this.#ctx.clearRect(-window.innerWidth, -window.innerHeight, window.innerWidth * 2, window.innerHeight * 2)
    }

    get ctx(){
        return this.#ctx
    }
}