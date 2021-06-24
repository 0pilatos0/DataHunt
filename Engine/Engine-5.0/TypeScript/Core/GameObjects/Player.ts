import Animation from "../Animation.js";
import AnimationController from "../AnimationController.js";
import BoxCollider from "../Colliders/BoxCollider.js";
import ColliderType from "../Enums/ColliderType.js";
import GameObject from "../GameObject.js";
import Inventory from "../Inventory.js";
import Item from "../Item.js";
import Tileset from "../Tileset.js";
import Vector2 from "../Vector2.js";
import Window from "../Window.js";

export default class Player extends GameObject{
    private _controllable: boolean
    private _speed: number = 500
    private _oldPosition: Vector2 = new Vector2(this.position.x, this.position.y)
    private _animationController: AnimationController
    private _inventory: Inventory | null = null

    constructor(position: Vector2, size: Vector2, controllable: boolean = false){
        super(position, size)
        this._controllable = controllable
        this._animationController = new AnimationController()
        new Tileset("/Engine-5.0/JavaScript/Players/Player1.png").on('load', (tileset: Tileset) => {
            for (let i = 0; i < tileset.tiles2D.length; i++) {
                let animation = new Animation()
                for (let j = 0; j < tileset.tiles2D[i].length; j++) {
                    animation.add(tileset.tiles2D[i][j].id, 200)
                }
                this._animationController.add(animation)
            }
            if(this._controllable){
                this.collider = new BoxCollider(new Vector2(0, 0), new Vector2(Window.active.spriteSize, Window.active.spriteSize), GameObject.gameObjects.indexOf(this), ColliderType.COLLIDABLE)
                this.collider?.on('enter', (gameObject: GameObject) => {
                    if(gameObject.collider?.type == ColliderType.COLLIDABLE){
                        if(Window.active.input.pressed('w')) this.position.y = Math.round(this._oldPosition.y)
                        if(Window.active.input.pressed('a')) this.position.x = Math.round(this._oldPosition.x)
                        if(Window.active.input.pressed('s')) this.position.y = Math.round(this._oldPosition.y)
                        if(Window.active.input.pressed('d')) this.position.x = Math.round(this._oldPosition.x)
                    }
                    if(gameObject.collider?.type == ColliderType.INTERACTABLE){
                        gameObject.destroy()
                    }
                })
                this.collider?.on('stay', (gameObject: GameObject) => {
                    if(gameObject.collider?.type == ColliderType.COLLIDABLE){
                        if(Window.active.input.pressed('w')) this.position.y = Math.round(this._oldPosition.y)
                        if(Window.active.input.pressed('a')) this.position.x = Math.round(this._oldPosition.x)
                        if(Window.active.input.pressed('s')) this.position.y = Math.round(this._oldPosition.y)
                        if(Window.active.input.pressed('d')) this.position.x = Math.round(this._oldPosition.x)
                    }
                })
                this._inventory = new Inventory()
                this._inventory?.add(new Item("Pizza"), 100)
                console.log(this._inventory.items)
            }
            this.layer = 10
            this.trigger('loadPlayer', this, true)
        })
    }

    public update(){
        this._oldPosition = new Vector2(this.position.x, this.position.y)
        let steps: number = 20
        if(Window.active.input.pressed('w')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.y = this.position.y
                this.position.y -= this._speed * Window.active.deltaTime / steps
                super.update()
            }
        }
        if(Window.active.input.pressed('a')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.x = this.position.x
                this.position.x -= this._speed * Window.active.deltaTime / steps
                super.update()
            }
        }
        if(Window.active.input.pressed('s')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.y = this.position.y
                this.position.y += this._speed * Window.active.deltaTime / steps
                super.update()
            }
        }
        if(Window.active.input.pressed('d')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.x = this.position.x
                this.position.x += this._speed * Window.active.deltaTime / steps
                super.update()
            }
        }

        if(Window.active.input.pressed('w') && !Window.active.input.pressed('d') && !Window.active.input.pressed('a')) this._animationController.active = 4
        else if(Window.active.input.pressed('a') && Window.active.input.pressed('w')) this._animationController.active = 5
        else if(Window.active.input.pressed('a') && !Window.active.input.pressed('w') && !Window.active.input.pressed('s')) this._animationController.active = 6
        else if(Window.active.input.pressed('a') && Window.active.input.pressed('s')) this._animationController.active = 7
        else if(Window.active.input.pressed('s') && !Window.active.input.pressed('a') && !Window.active.input.pressed('d')) this._animationController.active = 8
        else if(Window.active.input.pressed('d') && !Window.active.input.pressed('w') && !Window.active.input.pressed('s')) this._animationController.active = 2
        else if(Window.active.input.pressed('d') && Window.active.input.pressed('s')) this._animationController.active = 1
        else if(Window.active.input.pressed('d') && Window.active.input.pressed('w')) this._animationController.active = 3
        else this._animationController.active = 0
        this.spriteIndex = this._animationController.activeAnimation.activeSpriteIndex

        if(this.position.x < 0) this.position.x = 0
        if(this.position.y < 0) this.position.y = 0
        if(this.position.x + this.size.x > Window.active.scene.map.bounds.right) this.position.x = Window.active.scene.map.bounds.right - this.size.x
        if(this.position.y + this.size.y > Window.active.scene.map.bounds.bottom) this.position.y = Window.active.scene.map.bounds.bottom - this.size.y
    
        this._inventory?.update()
    }
}