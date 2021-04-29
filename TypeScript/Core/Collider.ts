import ColliderState from "./Enums/ColliderState.js";
import GameObject from "./GameObject.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";

export default class Collider extends Transform{
    private _parent: GameObject
    protected _state: ColliderState = ColliderState.DEFAULT
    protected _oldState: ColliderState = this._state
    protected _colliders: Array<GameObject> = []

    constructor(position: Vector2, size: Vector2, parent: GameObject){ 
        super(position, size)
        this._parent = parent
    }

    get parent(){
        return this._parent
    }

    public update(){

    }
}