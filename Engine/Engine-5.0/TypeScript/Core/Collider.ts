import ColliderState from "./Enums/ColliderState.js";
import ColliderType from "./Enums/ColliderType.js";
import GameObject from "./GameObject.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";

export default class Collider extends Transform{
    private _parentIndex: number
    protected _state: ColliderState = ColliderState.DEFAULT
    protected _oldState: ColliderState = this._state
    protected _colliders: Array<GameObject> = []
    protected _type: ColliderType

    constructor(position: Vector2, size: Vector2, parentIndex: number, type: ColliderType = ColliderType.DEFAULT){
        super(position, size)
        this._parentIndex = parentIndex
        this._type = type
    }

    get parentIndex(){
        return this._parentIndex
    }

    get parent(){
        return GameObject.gameObjects[this._parentIndex]
    }

    get type(){
        return this._type
    }

    public update(){

    }
}