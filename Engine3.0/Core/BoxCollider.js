import Collider from "./Collider.js";
import Scene from "./Scene.js";
import Sprite from "./Sprite.js";
export default class BoxCollider extends Collider {
    constructor(position, size, parent) {
        super(position, size, parent);
    }
    update() {
        super.update();
        Scene.active.visibleGameObjects.map(g => {
            if (g !== this.parent && g.spriteIndex > -1) {
                if (Sprite.sprites[g.spriteIndex].type != 0 /* DEFAULT */) {
                    let colliding = this.position.x < g.position.x + g.size.x &&
                        this.position.x + this.size.x > g.position.x &&
                        this.position.y < g.position.y + g.size.y &&
                        this.position.y + this.size.y > g.position.y;
                    this._state = colliding ? 1 /* COLLIDING */ : 0 /* DEFAULT */;
                    switch (this._state) {
                        case 0 /* DEFAULT */:
                            if (this._colliders.indexOf(g) > -1) {
                                this.trigger('exit', g);
                                this._colliders.splice(this._colliders.indexOf(g), 1);
                            }
                            break;
                        case 1 /* COLLIDING */:
                            if (this._colliders.indexOf(g) == -1) {
                                this.trigger('enter', g);
                                this._colliders.push(g);
                            }
                            if (this._colliders.indexOf(g) > -1) {
                                this.trigger('stay', g);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    }
    get state() {
        return this._state;
    }
}
