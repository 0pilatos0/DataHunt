import ColliderState from "./Enums/ColliderState.js";
import ColliderType from "./Enums/ColliderType.js";
import GameObject from "./GameObject.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";

export default class Collider extends Transform{
    private _parent: GameObject
    protected _state: ColliderState = ColliderState.DEFAULT
    protected _oldState: ColliderState = this._state
    protected _colliders: Array<GameObject> = []
    protected _type: ColliderType

    constructor(position: Vector2, size: Vector2, parent: GameObject, type: ColliderType = ColliderType.DEFAULT){
        super(position, size)
        this._parent = parent
        this._type = type
    }

    get parent(){
        return this._parent
    }

    get type(){
        return this._type
    }

    public update(){

    }
}