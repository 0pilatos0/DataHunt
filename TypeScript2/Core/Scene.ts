import Camera from "./Camera.js";
import GameObjectType from "./Enums/GameObjectType.js";
import Event from "./Event.js";
import GameObject from "./GameObject.js";
import Player from "./GameObjects/Player.js";
import Map from "./Map.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class Scene extends Event{
    public static scenes: Array<Scene> = []
    private static _activeScene: number = 0
    private _gameObjects: Array<GameObject> = []

    constructor(){
        super()
        Scene.scenes.push(this)
        new Map().on('load', () => {
            let playerPos = GameObject.getByType(GameObjectType.SPAWNPOINT)[Math.floor(Math.random() * GameObject.getByType(GameObjectType.SPAWNPOINT).length)].position
            new Player(playerPos, new Vector2(Window.spriteSize, Window.spriteSize), true).on('load', () => {
                new Camera(new Vector2(0, 0), new Vector2(0, 0))
                this.trigger('load', this)
            })
        })
    }

    public render(ctx: CanvasRenderingContext2D){
        let renderX: number = 0
        let renderY: number = 0
        if(Player.player.position.x + Player.player.size.x / 2 >= Window.displayWidth / 2) renderX = Player.player.position.x - Window.displayWidth / 2 - Player.player.size.x / 2 + Window.spriteSize
        if(Player.player.position.y + Player.player.size.y / 2 >= Window.displayHeight / 2) renderY = Player.player.position.y - Window.displayHeight / 2 - Player.player.size.y / 2 + Window.spriteSize
        if(Player.player.position.x + Player.player.size.x / 2 >= Map.active.bounds.right - Window.displayWidth / 2) renderX = Map.active.bounds.right - Window.displayWidth
        if(Player.player.position.y + Player.player.size.y / 2 >= Map.active.bounds.bottom - Window.displayHeight / 2) renderY = Map.active.bounds.bottom - Window.displayHeight
        Camera.active.position = new Vector2(renderX, renderY)
        this._gameObjects.map(g => {
            g.render(ctx)
        })
    }

    public update(){
        this._gameObjects = []
        GameObject.gameObjects.map(g => {
            if(g.position.x - Window.spriteSize <= Camera.active.position.x + Camera.active.size.x &&
                g.position.y - Window.spriteSize <= Camera.active.position.y + Camera.active.size.y &&
                g.position.x + Window.spriteSize * 2 >= Camera.active.position.x &&
                g.position.y + Window.spriteSize * 2 >= Camera.active.position.y
            ) this._gameObjects.push(g)
        })
        this._gameObjects.map(g => {
            g.visible = true
            g.update()
        })
    }

    public static get active(){
        return Scene.scenes[Scene._activeScene]
    }

    get gameObjects(){
        return this._gameObjects
    }
}