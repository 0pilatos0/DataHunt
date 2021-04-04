import Canvas from "./Canvas.js";
import Scene from "./Scene.js";
import Vector2 from "./Vector2.js";
export default class Window {
    constructor() {
        this._canvas = new Canvas();
        this._fps = 0;
        this._lastUpdate = Date.now();
        this._sceneIndex = -1;
        this._deltaTime = 0;
        this._displaySize = new Vector2(0, 0);
        Window.windows.push(this);
        new Scene().on('load', (sceneIndex) => {
            document.body.appendChild(this._canvas.element);
            this._sceneIndex = sceneIndex;
            this._resize();
            window.addEventListener('resize', this._resize.bind(this));
            window.requestAnimationFrame(this._render.bind(this));
            setInterval(() => { this._update(); }, 1000 / 60);
            setInterval(() => { this._fps = 0; }, 1000);
        });
    }
    _resize() {
        var _a;
        this._canvas.size = new Vector2(window.innerWidth, window.innerHeight);
        let scaleFitNative = (window.innerWidth >= 1920 ? Math.max(window.innerWidth / 1920, window.innerHeight / 1080) : Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
        this._displaySize = new Vector2(window.innerWidth / scaleFitNative, window.innerHeight / scaleFitNative);
        (_a = this._canvas.ctx) === null || _a === void 0 ? void 0 : _a.setTransform(scaleFitNative, 0, 0, scaleFitNative, window.innerWidth / 2, window.innerHeight / 2);
        if (this._canvas.ctx)
            this._canvas.ctx.imageSmoothingEnabled = scaleFitNative < 1;
        Scene.scenes[this._sceneIndex].camera.size = this._displaySize;
    }
    _render() {
        var _a, _b;
        window.requestAnimationFrame(this._render.bind(this));
        (_a = this._canvas.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(-this._displaySize.x / 2, -this._displaySize.y / 2, this._displaySize.x, this._displaySize.y);
        if (this._canvas.ctx)
            this._canvas.ctx.fillStyle = "#333";
        (_b = this._canvas.ctx) === null || _b === void 0 ? void 0 : _b.fillRect(-this._displaySize.x / 2, -this._displaySize.y / 2, this._displaySize.x, this._displaySize.y);
        Scene.scenes[this._sceneIndex].render(this._canvas.ctx);
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
}
Window.windows = [];
Window._activeWindow = 0;
