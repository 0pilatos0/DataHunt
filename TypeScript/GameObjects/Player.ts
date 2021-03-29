import Animation, { AnimationState } from "../Core/Animation.js";
import AnimationController from "../Core/AnimationController.js";
import GameObject from "../Core/GameObject.js";
import Sprite, { SpriteType } from "../Core/Sprite.js";
import Tileset from "../Core/Tileset.js";
import Vector2 from "../Core/Vector2.js";
declare var window: any
export default class Player extends GameObject{
    private _controllable: boolean = false
    private _keysPressed: Array<string> = []
    private _speed: number = 200
    private _oldPosition: Vector2 = new Vector2(this.position.x, this.position.y)
    private _animationController: AnimationController = new AnimationController()

    constructor(position: Vector2, size: Vector2, controllable: boolean = false){
        super(position, size)
        this._controllable = controllable
        this.init()
    }

    protected init(){
        if(this._controllable){
            this.beenRendered = true
            document.body.addEventListener('keydown', this.keydown.bind(this))
            document.body.addEventListener('keyup', this.keyup.bind(this))
            window.player = this
            new Tileset("/Engine3.0/Players/Player1.png").on('load', (tileset: Tileset) => {
                for (let i = 0; i < tileset.tiles2D.length; i++) {
                    let animation = new Animation()
                    for (let j = 0; j < tileset.tiles2D[i].length; j++) {
                        animation.add(tileset.tiles2D[i][j], 200)
                    }
                    this._animationController.add(animation)
                }
                super.init()
            })
        }
    }

    public render(ctx: CanvasRenderingContext2D){
        if(!this.sprite) return
        if(!this.visible) return
        let renderX: number | null = null
        let renderY: number | null = null
        if(this.position.x + this.size.x / 2 >= window.displayWidth / 2 && this.position.x + this.size.x / 2 < window.mapBoundX - window.displayWidth / 2) renderX = -this.size.x / 2
        if(this.position.y + this.size.y / 2 >= window.displayHeight / 2 && this.position.y + this.size.y / 2 < window.mapBoundY - window.displayHeight / 2) renderY = -this.size.y / 2
        if(this.position.x + this.size.x / 2 >= window.mapBoundX - window.displayWidth / 2) renderX = this.position.x - window.mapBoundX + window.displayWidth / 2
        if(this.position.y + this.size.y / 2 >= window.mapBoundY - window.displayHeight / 2) renderY = this.position.y - window.mapBoundY - window.displayHeight / 2
        ctx.drawImage(this.sprite.sprite, renderX ?? this.position.x - window.displayWidth / 2, renderY ?? this.position.y - window.displayHeight / 2)
    }

    public update(){
        super.update()
        this._oldPosition = new Vector2(this.position.x, this.position.y)
        let steps: number = 15
        for (let k = 0; k < this._keysPressed.length; k++) {
            let key = this._keysPressed[k]
            switch (key) {
                case 'w':
                case 'W':
                    for (let s = 0; s < steps; s++) {
                        this.position.y -= this._speed * window.deltaTime / steps
                        this.checkCollisions(() => {this.position.y = Math.round(this._oldPosition.y)})
                    }
                    break;
                case 'a':
                case 'A':
                    for (let s = 0; s < steps; s++) {
                        this.position.x -= this._speed * window.deltaTime / steps
                        this.checkCollisions(() => {this.position.x = Math.round(this._oldPosition.x)})
                    }
                    break;
                case 's':
                case 'S':
                    for (let s = 0; s < steps; s++) {
                        this.position.y += this._speed * window.deltaTime / steps
                        this.checkCollisions(() => {this.position.y = Math.round(this._oldPosition.y)})
                    }
                    break;
                case 'd':
                case 'D':
                    for (let s = 0; s < steps; s++) {
                        this.position.x += this._speed * window.deltaTime / steps
                        this.checkCollisions(() => {this.position.x = Math.round(this._oldPosition.x)})
                    }
                    break;
                default:
                    break;
            }
        }

        if(this.pressed('w') && !this.pressed('d') && !this.pressed('a')) this._animationController.active = 4
        else if(this.pressed('a') && this.pressed('w')) this._animationController.active = 5
        else if(this.pressed('a') && !this.pressed('w') && !this.pressed('s')) this._animationController.active = 6
        else if(this.pressed('a') && this.pressed('s')) this._animationController.active = 7
        else if(this.pressed('s') && !this.pressed('a') && !this.pressed('d')) this._animationController.active = 8
        else if(this.pressed('d') && !this.pressed('w') && !this.pressed('s')) this._animationController.active = 2
        else if(this.pressed('d') && this.pressed('s')) this._animationController.active = 1
        else if(this.pressed('d') && this.pressed('w')) this._animationController.active = 3
        else this._animationController.active = 0
        this.sprite = this._animationController.activeSprite

        if(this.position.x < 0) this.position.x = 0
        if(this.position.y < 0) this.position.y = 0
        if(this.position.x + this.size.x > window.mapBoundX) this.position.x = window.mapBoundX - this.size.x
        if(this.position.y + this.size.y > window.mapBoundY) this.position.y = window.mapBoundY - this.size.y
    }

    private keydown(e: KeyboardEvent){
        if(this._keysPressed.indexOf(e.key) == -1) this._keysPressed.push(e.key)
    }

    private keyup(e: KeyboardEvent){
        this._keysPressed.splice(this._keysPressed.indexOf(e.key), 1)
    }

    private pressed(key: string){
        return this._keysPressed.indexOf(key) > -1
    }

    private checkCollisions(callback: Function){
        if(!window.mapRenderArea) return
        for (let l = 0; l < window.mapRenderArea.length; l++) {
            for (let y = 0; y < window.mapRenderArea[l].length; y++) {
                for (let x = 0; x < window.mapRenderArea[l][y].length; x++) {
                    let gameObject: GameObject | null = window.mapRenderArea[l][y][x]
                    if(gameObject == null) continue
                    if(!gameObject.visible) continue
                    if(gameObject.sprite.type == SpriteType.DEFAULT) continue
                    if(gameObject == this) continue
                    if(gameObject.position.x < this.position.x - window.displayWidth / 2 && gameObject.position.x >= this.position.x + window.displayWidth / 2) continue
                    if(gameObject.position.y < this.position.y - window.displayHeight / 2 && gameObject.position.y >= this.position.y + window.displayHeight / 2) continue
                    if(!this.colliding(gameObject)) continue
                    switch (gameObject.sprite.type) {
                        case SpriteType.COLLIDABLE:
                            callback()
                            break;
                        case SpriteType.INTERACTABLE:
                            //gameObject.destroy()
                            gameObject.visible = false //TODO make it destroyable
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}