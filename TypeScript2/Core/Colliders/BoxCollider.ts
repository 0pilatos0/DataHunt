import Collider from "../Collider.js";
import ColliderState from "../Enums/ColliderState.js";
import ColliderType from "../Enums/ColliderType.js";
import GameObject from "../GameObject.js";
import Scene from "../Scene.js";
import Vector2 from "../Vector2.js";

export default class BoxCollider extends Collider{
    constructor(position: Vector2, size: Vector2, parent:GameObject, type: ColliderType = ColliderType.DEFAULT){
        super(position, size, parent, type)
    }

    public update(){
        super.update()
        Scene.active.gameObjects.map(g => {
            if(g !== this.parent && g.visible && g.collider){
                if(g.collider.type != ColliderType.DEFAULT){
                    let colliding = this.position.x < g.collider.position.x + g.collider.size.x &&
                    this.position.x + this.size.x > g.collider.position.x &&
                    this.position.y < g.position.y + g.collider.size.y &&
                    this.position.y + this.size.y > g.collider.position.y
                    this._state = colliding ? ColliderState.COLLIDING : ColliderState.DEFAULT
                    switch (this._state) {
                        case ColliderState.DEFAULT:
                            if(this._colliders.indexOf(g) > -1){
                                this.trigger('exit', g)
                                this._colliders.splice(this._colliders.indexOf(g), 1)
                            }
                            break;
                        case ColliderState.COLLIDING:
                            if(this._colliders.indexOf(g) == -1){
                                this.trigger('enter', g)
                                this._colliders.push(g)
                            } 
                            if(this._colliders.indexOf(g) > -1){
                                this.trigger('stay', g)
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        })
    }
}