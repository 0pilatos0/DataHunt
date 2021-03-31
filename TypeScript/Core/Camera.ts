import GameObject from "./GameObject.js"
import Transform from "./Transform.js"
import Vector2 from "./Vector2.js"

export default class Camera extends Transform{
    static cameras: Array<Camera> = []
    private static _activeCamera: number = 0

    constructor(position: Vector2, size: Vector2){
        super(position, size)
        Camera.cameras.push(this)
    }

    public setActive(){
        Camera._activeCamera = Camera.cameras.indexOf(this)
    }

    public static get active(){
        return Camera.cameras[Camera._activeCamera]
    }
}