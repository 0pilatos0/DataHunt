import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";

export default class Camera extends Transform{
    public static cameras: Array<Camera> = []

    constructor(position: Vector2 = new Vector2(0, 0), size: Vector2 = new Vector2(0, 0), keepTrying: boolean = false){
        super(position, size)
        Camera.cameras.push(this)
        this.trigger('load', Camera.cameras.indexOf(this), keepTrying)
    }
}