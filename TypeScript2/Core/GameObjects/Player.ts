import Animation from "../Animation.js";
import AnimationController from "../AnimationController.js";
import ColliderType from "../Enums/ColliderType.js";
import GameObject from "../GameObject.js";
import Input from "../Input.js";
import Map from "../Map.js";
import Tileset from "../Tileset.js";
import Vector2 from "../Vector2.js";
import Window from "../Window.js";

export default class Player extends GameObject{
    public static player: GameObject

    private _controllable: boolean = false
    private _speed: number = 500
    private _oldPosition: Vector2 = new Vector2(this.position.x, this.position.y)
    private _animationController: AnimationController = new AnimationController()

    constructor(position: Vector2, size: Vector2, controllable: boolean = false){
        super(position, size)
        this._controllable = controllable
        if(this._controllable){
            Player.player = this
            new Tileset("/Engine4.0/Players/Player1.png").on('load', (tileset: Tileset) => {
                for (let i = 0; i < tileset.tiles2D.length; i++) {
                    let animation = new Animation()
                    for (let j = 0; j < tileset.tiles2D[i].length; j++) {
                        animation.add(tileset.tiles2D[i][j], 200)
                    }
                    this._animationController.add(animation)
                }
                this.collider?.on('enter', (gameObject: GameObject) => {
                    if(gameObject.collider?.type == ColliderType.COLLIDABLE){
                        if(Input.pressed('w')) this.position.y = Math.round(this._oldPosition.y)
                        if(Input.pressed('a')) this.position.x = Math.round(this._oldPosition.x)
                        if(Input.pressed('s')) this.position.y = Math.round(this._oldPosition.y)
                        if(Input.pressed('d')) this.position.x = Math.round(this._oldPosition.x)
                    }
                    if(gameObject.collider?.type == ColliderType.INTERACTABLE){
                        gameObject.destroy()
                    }
                })
                this.collider?.on('stay', (gameObject: GameObject) => {
                    if(gameObject.collider?.type == ColliderType.COLLIDABLE){
                        if(Input.pressed('w')) this.position.y = Math.round(this._oldPosition.y)
                        if(Input.pressed('a')) this.position.x = Math.round(this._oldPosition.x)
                        if(Input.pressed('s')) this.position.y = Math.round(this._oldPosition.y)
                        if(Input.pressed('d')) this.position.x = Math.round(this._oldPosition.x)
                    }
                })
            })
        }   
    }
    
    public update(){
        this._oldPosition = new Vector2(this.position.x, this.position.y)
        let steps: number = 20
        if(Input.pressed('w')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.y = this.position.y
                this.position.y -= this._speed * Window.deltaTime / steps
                super.update()
            }
        }
        if(Input.pressed('a')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.x = this.position.x
                this.position.x -= this._speed * Window.deltaTime / steps
                super.update()
            }
        }
        if(Input.pressed('s')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.y = this.position.y
                this.position.y += this._speed * Window.deltaTime / steps
                super.update()
            }
        }
        if(Input.pressed('d')){
            for (let s = 0; s < steps; s++) {
                this._oldPosition.x = this.position.x
                this.position.x += this._speed * Window.deltaTime / steps
                super.update()
            }
        }

        if(Input.pressed('w') && !Input.pressed('d') && !Input.pressed('a')) this._animationController.active = 4
        else if(Input.pressed('a') && Input.pressed('w')) this._animationController.active = 5
        else if(Input.pressed('a') && !Input.pressed('w') && !Input.pressed('s')) this._animationController.active = 6
        else if(Input.pressed('a') && Input.pressed('s')) this._animationController.active = 7
        else if(Input.pressed('s') && !Input.pressed('a') && !Input.pressed('d')) this._animationController.active = 8
        else if(Input.pressed('d') && !Input.pressed('w') && !Input.pressed('s')) this._animationController.active = 2
        else if(Input.pressed('d') && Input.pressed('s')) this._animationController.active = 1
        else if(Input.pressed('d') && Input.pressed('w')) this._animationController.active = 3
        else this._animationController.active = 0
        this.spriteIndex = this._animationController.activeAnimation.activeSpriteIndex

        if(this.position.x < 0) this.position.x = 0
        if(this.position.y < 0) this.position.y = 0
        if(this.position.x + this.size.x > Map.active.bounds.right) this.position.x = Map.active.bounds.right - this.size.x
        if(this.position.y + this.size.y > Map.active.bounds.bottom) this.position.y = Map.active.bounds.bottom - this.size.y
    }
}