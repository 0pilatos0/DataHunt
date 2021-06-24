import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
export default class Camera extends Transform {
    constructor(position = new Vector2(0, 0), size = new Vector2(0, 0), keepTrying = false) {
        super(position, size);
        Camera.cameras.push(this);
        this.trigger('load', Camera.cameras.indexOf(this), keepTrying);
    }
}
Camera.cameras = [];
