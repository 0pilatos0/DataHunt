import Vector2 from "./Vector2";
export default class Camera {
    constructor() {
        this._position = new Vector2(0, 0);
        this._size = new Vector2(0, 0);
        this.init();
    }
    init() {
        Camera.cameras.push(this);
    }
    setActive() {
        Camera._activeCamera = Camera.cameras.indexOf(this);
    }
    static get activeCamera() {
        return Camera.cameras[Camera._activeCamera];
    }
}
Camera.cameras = [];
Camera._activeCamera = 0;
