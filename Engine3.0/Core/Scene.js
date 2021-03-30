import Camera from "./Camera";
import Vector2 from "./Vector2";
export default class Scene {
    constructor() {
        this._camera = new Camera(new Vector2(0, 0), new Vector2(0, 0));
        this.init();
    }
    init() {
        Scene.scenes.push(this);
    }
    static get active() {
        return Scene.scenes[Scene._activeScene];
    }
    get camera() {
        return this._camera;
    }
}
Scene.scenes = [];
Scene._activeScene = 0;
