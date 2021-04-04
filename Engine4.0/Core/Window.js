import Camera from "./Camera.js";
import Canvas from "./Canvas.js";
import Scene from "./Scene.js";
import Vector2 from "./Vector2.js";
export default class Window {
    constructor() {
        this._canvas = new Canvas();
        this._fps = 0;
        this._lastUpdate = Date.now();
        this._scene = null;
        document.body.appendChild(this._canvas.element);
        new Scene().on('load', (scene) => {
            this._scene = scene;
            this.resize();
            window.addEventListener('resize', this.resize.bind(this));
            window.requestAnimationFrame(this.render.bind(this));
            setInterval(() => { this.update(); }, 1000 / 60);
            setInterval(() => { this._fps = 0; }, 1000);
        });
    }
    resize() {
        this._canvas.element.width = window.innerWidth;
        this._canvas.element.height = window.innerHeight;
        let scaleFitNative = (window.innerWidth >= 1920 ? Math.max(window.innerWidth / 1920, window.innerHeight / 1080) : Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
        Window.displayWidth = window.innerWidth / scaleFitNative;
        Window.displayHeight = window.innerHeight / scaleFitNative;
        this._canvas.ctx.setTransform(scaleFitNative, 0, 0, scaleFitNative, window.innerWidth / 2, window.innerHeight / 2);
        this._canvas.ctx.imageSmoothingEnabled = scaleFitNative < 1;
        Camera.active.size = new Vector2(Window.displayWidth, Window.displayHeight);
    }
    render() {
        var _a;
        window.requestAnimationFrame(this.render.bind(this));
        this._canvas.ctx.clearRect(-Window.displayWidth / 2, -Window.displayHeight / 2, Window.displayWidth, Window.displayHeight);
        this._canvas.ctx.fillStyle = "#333";
        this._canvas.ctx.fillRect(-Window.displayWidth / 2, -Window.displayHeight / 2, Window.displayWidth, Window.displayHeight);
        (_a = this._scene) === null || _a === void 0 ? void 0 : _a.render(this._canvas.ctx);
    }
    update() {
        var _a;
        let now = Date.now();
        Window.deltaTime = (now - this._lastUpdate) / 1000;
        this._lastUpdate = now;
        this._fps++;
        (_a = this._scene) === null || _a === void 0 ? void 0 : _a.update();
    }
}
Window.spriteSize = 96;
Window.spriteScaleFactor = 96 / 32;
Window.displayWidth = 0;
Window.displayHeight = 0;
Window.deltaTime = 0;
