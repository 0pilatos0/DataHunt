import Canvas from "./Canvas.js"
import Scene from "./Scene.js"
import Vector2 from "./Vector2.js"
export default class Window{
    // public static windows: Array<Window> = []
    // private static _activeWindow: number = 0
    public static spriteSize: number = 128
    public static spriteScaleFactor: number = Window.spriteSize / 32
    public static displayWidth: number = 0
    public static displayHeight: number = 0
    public static deltaTime: number = 0
    private _canvas: Canvas = new Canvas()
    private _fps: number = 0
    private _lastUpdate: number = Date.now()
    private _scene: Scene | null = null

    constructor(){
        //Window.windows.push(this)
        document.body.appendChild(this._canvas.element)
        new Scene().on('load', (scene: Scene) => {
            this._scene = scene
            this.resize()
            window.addEventListener('resize', this.resize.bind(this))
            window.requestAnimationFrame(this.render.bind(this))
            setInterval(() => {this.update()}, 1000/60)
            setInterval(() => {this._fps = 0}, 1000)
        })
    }

    private resize(){
        this._canvas.element.width = window.innerWidth
        this._canvas.element.height = window.innerHeight
        let scaleFitNative = (window.innerWidth >= 1920 ? Math.max(window.innerWidth / 1920, window.innerHeight / 1080) : Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
        Window.displayWidth = window.innerWidth / scaleFitNative
        Window.displayHeight = window.innerHeight / scaleFitNative
        this._canvas.ctx.setTransform(scaleFitNative, 0, 0, scaleFitNative, window.innerWidth / 2, window.innerHeight / 2)
        this._canvas.ctx.imageSmoothingEnabled = scaleFitNative < 1
        if(this._scene) this._scene.camera.size = new Vector2(Window.displayWidth, Window.displayHeight)
    }

    private render(){
        window.requestAnimationFrame(this.render.bind(this))
        this._canvas.ctx.clearRect(-Window.displayWidth / 2, -Window.displayHeight / 2, Window.displayWidth, Window.displayHeight)
        this._canvas.ctx.fillStyle = "#333"
        this._canvas.ctx.fillRect(-Window.displayWidth / 2, -Window.displayHeight / 2, Window.displayWidth, Window.displayHeight)
        this._scene?.render(this._canvas.ctx)
    }

    private update(){
        let now = Date.now()
        Window.deltaTime = (now - this._lastUpdate) / 1000
        this._lastUpdate = now
        this._fps++
        this._scene?.update()
    }

    // public static get active(){
    //     return Window.windows[Window._activeWindow]
    // }
}