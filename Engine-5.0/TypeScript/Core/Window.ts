import Canvas from "./Canvas.js"
import Scene from "./Scene.js"
import Vector2 from "./Vector2.js"

export default class Window{
    public static windows: Array<Window> = []
    private static _activeWindow: number = 0

    private _canvas: Canvas = new Canvas()
    private _fps: number = 0
    private _lastUpdate: number = Date.now()
    private _sceneIndex: number = -1
    private _deltaTime: number = 0
    private _displaySize: Vector2 = new Vector2(0, 0)

    constructor(){
        Window.windows.push(this)
        new Scene().on('load', (sceneIndex: number) => {
            document.body.appendChild(this._canvas.element)
            this._sceneIndex = sceneIndex
            this._resize()
            window.addEventListener('resize', this._resize.bind(this))
            window.requestAnimationFrame(this._render.bind(this))
            setInterval(() => {this._update()}, 1000/60)
            setInterval(() => {this._fps = 0}, 1000)
        })
    }

    private _resize(){
        this._canvas.size = new Vector2(window.innerWidth, window.innerHeight)
        let scaleFitNative = (window.innerWidth >= 1920 ? Math.max(window.innerWidth / 1920, window.innerHeight / 1080) : Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
        this._displaySize = new Vector2(window.innerWidth / scaleFitNative, window.innerHeight / scaleFitNative)
        this._canvas.ctx?.setTransform(scaleFitNative, 0, 0, scaleFitNative, window.innerWidth / 2, window.innerHeight / 2)
        if(this._canvas.ctx) this._canvas.ctx.imageSmoothingEnabled = scaleFitNative < 1
        Scene.scenes[this._sceneIndex].camera.size = this._displaySize
    }

    private _render(){
        window.requestAnimationFrame(this._render.bind(this))
        this._canvas.ctx?.clearRect(-this._displaySize.x / 2, -this._displaySize.y / 2, this._displaySize.x, this._displaySize.y)
        if(this._canvas.ctx) this._canvas.ctx.fillStyle = "#333"
        this._canvas.ctx?.fillRect(-this._displaySize.x / 2, -this._displaySize.y / 2, this._displaySize.x, this._displaySize.y)
        Scene.scenes[this._sceneIndex].render(this._canvas.ctx)
    }

    private _update(){
        let now = Date.now()
        Scene.scenes[this._sceneIndex].update()
        this._deltaTime = (now - this._lastUpdate) / 1000
        this._lastUpdate = now
        this._fps++
    }

    public get spriteSize(){
        return 96
    }

    public get spriteScaleFactor(){
        return this.spriteSize / 32
    }

    public get displaySize(){
        return this._displaySize
    }

    public get deltaTime(){
        return this._deltaTime
    }

    public get scene(){
        return Scene.scenes[this._sceneIndex]
    }

    public get fps(){
        return this._fps
    }

    public static get active(){
        return Window.windows[Window._activeWindow]
    }
}