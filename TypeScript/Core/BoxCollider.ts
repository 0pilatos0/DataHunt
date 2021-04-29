import Collider from "./Collider.js";
import ColliderState from "./Enums/ColliderState.js";
import SpriteType from "./Enums/SpriteType.js";
import GameObject from "./GameObject.js";
import Scene from "./Scene.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";

export default class BoxCollider extends Collider{
    constructor(position: Vector2, size: Vector2, parent: GameObject){
        super(position, size, parent)
    }

    public update(){
        super.update()
        Scene.active.visibleGameObjects.map(g => {
            if(g !== this.parent && g.spriteIndex > -1){
                if(Sprite.sprites[g.spriteIndex].type != SpriteType.DEFAULT){
                    let colliding = this.position.x < g.position.x + g.size.x &&
                    this.position.x + this.size.x > g.position.x &&
                    this.position.y < g.position.y + g.size.y &&
                    this.position.y + this.size.y > g.position.y
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

    get state(){
        return this._state
    }
}