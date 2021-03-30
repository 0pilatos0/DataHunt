import Transform from "./Transform.js";
export default class Camera extends Transform {
    constructor(position, size) {
        super(position, size);
        this.init();
    }
    init() {
        Camera.cameras.push(this);
    }
    setActive() {
        Camera._activeCamera = Camera.cameras.indexOf(this);
    }
    static get active() {
        return Camera.cameras[Camera._activeCamera];
    }
}
Camera.cameras = [];
Camera._activeCamera = 0;
