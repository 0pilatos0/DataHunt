import Vector2 from "./Vector2"

export default class Camera{
    static cameras: Array<Camera> = []
    private static _activeCamera: number = 0

    private _position: Vector2 = new Vector2(0, 0)
    private _size: Vector2 = new Vector2(0, 0)

    constructor(){
        this.init()
    }

    private init(){
        Camera.cameras.push(this)
    }

    public setActive(){
        Camera._activeCamera = Camera.cameras.indexOf(this)
    }

    public static get activeCamera(){
        return Camera.cameras[Camera._activeCamera]
    }
}