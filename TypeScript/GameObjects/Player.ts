import GameObject from "../Core/GameObject";
import Vector2 from "../Core/Vector2";

export default class Player extends GameObject{
    constructor(position: Vector2, size: Vector2){
        super(position, size)
        
    }
}