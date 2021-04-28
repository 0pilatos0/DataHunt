import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Input from "./Input.js";
import Scene from "./Scene.js";
import Vector2 from "./Vector2.js";
export default class Window extends Event {
    constructor() {
        super();
        this._canvas = new Canvas();
        this._fps = 0;
        this._lastUpdate = Date.now();
        this._sceneIndex = -1;
        this._deltaTime = 0;
        this._displaySize = new Vector2(0, 0);
        this._allowedToRender = false;
        this._input = new Input();
        document.body.appendChild(this._canvas.element);
        let gameLoader = document.getElementById('gameLoader');
        let gameLoaderTitle = document.getElementById('gameLoaderTitle');
        if (gameLoaderTitle)
            gameLoaderTitle.innerText = "Loading resources";
        Window.windows.push(this);
        new Scene().on('load', (sceneIndex) => {
            this._sceneIndex = sceneIndex;
            this._resize();
            window.addEventListener('resize', this._resize.bind(this));
            window.addEventListener('focus', () => { });
            window.addEventListener('blur', () => { this._input.keys = []; });
            //connect() //yes typescript parser report this as undefined, but it is defined inside the html page
            this._allowedToRender = true;
            if (gameLoader)
                gameLoader.style.display = "none";
            let updateInterval = setInterval(() => { this._update(); }, 1000 / 60);
            window.requestAnimationFrame(this._render.bind(this));
            let fpsInterval = setInterval(() => { this._fps = 0; }, 1000);
            // clearInterval(updateInterval)
            // clearInterval(fpsInterval)
            // if(gameLoaderTitle) gameLoaderTitle.innerText = "Connecting to server"
            // let socket = new Socket()
            // socket.on('connected', () => {
            //     console.log("connected :)")
            //     this._allowedToRender = true
            //     window.requestAnimationFrame(this._render.bind(this))
            //     updateInterval = setInterval(() => {this._update()}, 1000/60)
            //     fpsInterval = setInterval(() => {this._fps = 0}, 1000)
            //     if(gameLoader) gameLoader.style.display = "none"
            // })
            // socket.on('disconnected', () => {
            //     console.log("disconnected :(")
            //     this._allowedToRender = false
            //     clearInterval(updateInterval)
            //     clearInterval(fpsInterval)
            //     setTimeout(() => { this._canvas.clear() }, 1000/60)
            //     if(gameLoader) gameLoader.style.display = "block"
            // })
            // socket.on('failed', () => {
            //     console.log('Can\'t connect')
            //     this._allowedToRender = false
            //     clearInterval(updateInterval)
            //     clearInterval(fpsInterval)
            //     setTimeout(() => { this._canvas.clear() }, 1000/60)
            //     if(gameLoader) gameLoader.style.display = "block"
            // })
        });
    }
    _resize() {
        this._canvas.size = new Vector2(window.innerWidth, window.innerHeight);
        let scaleFitNative = (window.innerWidth >= 1920 ? Math.max(window.innerWidth / 1920, window.innerHeight / 1080) : Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
        this._displaySize = new Vector2(window.innerWidth / scaleFitNative, window.innerHeight / scaleFitNative);
        this._canvas.setTransform(scaleFitNative, 0, 0, scaleFitNative, window.innerWidth / 2, window.innerHeight / 2);
        this._canvas.imageSmoothingEnabled = scaleFitNative < 1;
        Scene.scenes[this._sceneIndex].camera.size = this._displaySize;
    }
    _render() {
        if (this._allowedToRender)
            window.requestAnimationFrame(this._render.bind(this));
        this._canvas.clearRect(new Vector2(-this._displaySize.x / 2, -this._displaySize.y / 2), this.displaySize);
        if (this._canvas)
            this._canvas.fillStyle = "#333";
        this._canvas.fillRect(new Vector2(-this._displaySize.x / 2, -this._displaySize.y / 2), this.displaySize);
        Scene.scenes[this._sceneIndex].render(this._canvas);
    }
    _update() {
        let now = Date.now();
        Scene.scenes[this._sceneIndex].update();
        this._deltaTime = (now - this._lastUpdate) / 1000;
        this._lastUpdate = now;
        this._fps++;
    }
    get spriteSize() {
        return 96;
    }
    get spriteScaleFactor() {
        return this.spriteSize / 32;
    }
    get displaySize() {
        return this._displaySize;
    }
    get deltaTime() {
        return this._deltaTime;
    }
    get scene() {
        return Scene.scenes[this._sceneIndex];
    }
    get fps() {
        return this._fps;
    }
    static get active() {
        return Window.windows[Window._activeWindow];
    }
    get input() {
        return this._input;
    }
}
Window.windows = [];
Window._activeWindow = 0;
