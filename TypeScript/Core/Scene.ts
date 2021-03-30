import Camera from "./Camera"
import Vector2 from "./Vector2"

export default class Scene{
    public static scenes: Array<Scene> = []
    private static _activeScene: number = 0

    private _camera: Camera = new Camera(new Vector2(0, 0), new Vector2(0, 0))

    constructor(){
        this.init()
    }

    private init(){
        Scene.scenes.push(this)
        
    }

    public static get active(){
        return Scene.scenes[Scene._activeScene]
    }

    get camera(){
        return this._camera
    }
}