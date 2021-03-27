import GameObject from "../Core/GameObject.js";
import Tileset from "../Core/Tileset.js";
import Vector2 from "../Core/Vector2.js";
declare var window: any
export default class Player extends GameObject{
    private _controllable: boolean = false
    private _keysPressed: Array<string> = new Array
    private _speed: number = 500
    private _oldPosition: Vector2 = new Vector2(this.position.x, this.position.y)
    private _animations = []

    constructor(position: Vector2, size: Vector2, controllable: boolean = false){
        super(position, size)
        this._controllable = controllable
        this.initialize()
    }

    private initialize(){
        if(this._controllable){
            window.player = this
            document.body.addEventListener('keydown', this.keydown)
            document.body.addEventListener('keyup', this.keyup)
            new Tileset("/Engine3.0/Players/Player1.png").on('load', (tileset: Tileset) => {
                console.log(tileset)
                for (let i = 0; i < tileset.tiles.length; i++) {
                    
                }
                this.trigger('load')
            })
        }
    }

    public render(ctx: CanvasRenderingContext2D){
        super.render(ctx)
    }

    public update(){
        super.update()
        this._oldPosition = new Vector2(this.position.x, this.position.y)
    }

    private keydown(e: KeyboardEvent){
        if(this._keysPressed.indexOf(e.key) == -1) this._keysPressed.push(e.key)
    }

    private keyup(e: KeyboardEvent){
        this._keysPressed.splice(this._keysPressed.indexOf(e.key), 1)
    }
}