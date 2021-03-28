import Player from "../GameObjects/Player.js"
import Canvas from "./Canvas.js"
import Map from "./Map.js"
import Vector2 from "./Vector2.js"
declare var window: any
export default class Window{
    private _canvas: Canvas = new Canvas()
    private _fps: number = 0
    private _lastUpdate: number = Date.now()
    private _map?: Map
    private _player?: Player

    constructor(){
        this.init()
    }

    private init(){
        window.gameObjects = []
        document.body.appendChild(this._canvas.element)
        new Map('/Engine3.0/Maps/Main/Map.json').on('load', (map: Map) => {
            this._map = map
            new Player(new Vector2(0, 0), new Vector2(window.spriteSize, window.spriteSize), true).on('load', (player: Player) => {
                this._player = player
                this.resize()
                window.addEventListener('resize', this.resize.bind(this))
                window.requestAnimationFrame(this.render.bind(this))
                setInterval(() => {this.update()}, 1000/60)
                setInterval(() => {this._fps = 0}, 1000)
            })
        })
    }

    private resize(){
        this._canvas.element.width = window.innerWidth
        this._canvas.element.height = window.innerHeight
        let scaleFitNative = (window.innerWidth >= 1920 ? Math.max(window.innerWidth / 1920, window.innerHeight / 1080) : Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
        window.displayWidth = window.innerWidth / scaleFitNative
        window.displayHeight = window.innerHeight / scaleFitNative
        this._canvas.ctx.setTransform(scaleFitNative, 0, 0, scaleFitNative, window.innerWidth / 2, window.innerHeight / 2)
        this._canvas.ctx.imageSmoothingEnabled = scaleFitNative < 1
        window.maxSpritesX = Math.round(window.displayWidth / window.spriteSize) + 2
        window.maxSpritesY = Math.round(window.displayHeight / window.spriteSize) + 2
    }

    private render(){
        window.requestAnimationFrame(this.render.bind(this))
        this._canvas.ctx.clearRect(-window.displayWidth / 2, -window.displayHeight / 2, window.displayWidth, window.displayHeight)
        this._canvas.ctx.fillStyle = "#333"
        this._canvas.ctx.fillRect(-window.displayWidth / 2, -window.displayHeight / 2, window.displayWidth, window.displayHeight)
        this._map?.render(this._canvas.ctx)
        this._player?.render(this._canvas.ctx)
    }

    private update(){
        let now = Date.now()
        window.deltaTime = (now - this._lastUpdate) / 1000
        this._lastUpdate = now
        this._fps++
        this._map?.update()
        this._player?.update()
    }
}