import GameObjectType from "./Enums/GameObjectType.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";

export default class GameObject extends Transform{
    private _type: GameObjectType
    private _spriteIndex: number

    constructor(position: Vector2, size: Vector2, spriteIndex: number = -1, type: GameObjectType = GameObjectType.DEFAULT){
        super(position, size)
        this._type = type
        this._spriteIndex = spriteIndex
    }
}