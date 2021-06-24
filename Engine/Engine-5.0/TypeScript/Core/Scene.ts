import Camera from "./Camera.js"
import Canvas from "./Canvas.js"
import GameObjectType from "./Enums/GameObjectType.js"
import Event from "./Event.js"
import GameObject from "./GameObject.js"
import Player from "./GameObjects/Player.js"
import Map from "./Map.js"
import Vector2 from "./Vector2.js"
import Window from "./Window.js"

export default class Scene extends Event{
    public static scenes: Array<Scene> = []
    
    private _gameObjects: Array<number> = []
    private _cameraIndex: number = -1
    private _mapIndex: number = -1
    private _player: Player | null = null

    constructor(){
        super()
        Scene.scenes.push(this)
        new Map().on('load', (mapIndex: number) => {
            this._mapIndex = mapIndex
            new Camera(new Vector2(0, 0), new Vector2(0, 0), true).on('load', (cameraIndex: number) => {
                this._cameraIndex = cameraIndex
                let playerPos = GameObject.getByType(GameObjectType.SPAWNPOINT)[Math.floor(Math.random() * GameObject.getByType(GameObjectType.SPAWNPOINT).length)].position
                new Player(playerPos, new Vector2(Window.active.spriteSize, Window.active.spriteSize), true).on('loadPlayer', (player: Player) => {
                    this._player = player
                    this.trigger('load', Scene.scenes.indexOf(this), true)
                })
            })
        })
    }

    public render(canvas: Canvas){
        //TODO fix rendering
        //TODO fix quality of images with black lines
        let renderPosition = new Vector2(0, 0)
        if(this._player){
            if(this._player.position.x + this._player.size.x / 2 >= Window.active.displaySize.x / 2) renderPosition.x = this._player.position.x - Window.active.displaySize.x / 2 - this._player.size.x / 2 + Window.active.spriteSize
            if(this._player.position.y + this._player.size.y / 2 >= Window.active.displaySize.y / 2) renderPosition.y = this._player.position.y - Window.active.displaySize.y / 2 - this._player.size.y / 2 + Window.active.spriteSize
            if(this._player.position.x + this._player.size.x / 2 >= this.map.bounds.right - Window.active.displaySize.x / 2) renderPosition.x = this.map.bounds.right - Window.active.displaySize.x
            if(this._player.position.y + this._player.size.y / 2 >= this.map.bounds.bottom - Window.active.displaySize.y / 2) renderPosition.y = this.map.bounds.bottom - Window.active.displaySize.y
        }
        Camera.cameras[this._cameraIndex].position = renderPosition
        this._gameObjects.map(g => {
            let go = GameObject.gameObjects[g]
            go.render(canvas)
        })
    }

    public update(){
        this._gameObjects = []
        GameObject.sortByLayer.map(g => {
            if(g.position.x - Window.active.spriteSize <= Camera.cameras[this._cameraIndex].position.x + Camera.cameras[this._cameraIndex].size.x &&
                g.position.y - Window.active.spriteSize <= Camera.cameras[this._cameraIndex].position.y + Camera.cameras[this._cameraIndex].size.y &&
                g.position.x + Window.active.spriteSize * 2 >= Camera.cameras[this._cameraIndex].position.x &&
                g.position.y + Window.active.spriteSize * 2 >= Camera.cameras[this._cameraIndex].position.y
            ) this._gameObjects.push(GameObject.gameObjects.indexOf(g))
            else{
                g.visible = false
            }
        })
        this._gameObjects.map(g => {
            let go = GameObject.gameObjects[g]
            go.visible = true
            go.update()
        })
    }

    public get map(){
        return Map.maps[this._mapIndex]
    }

    public get camera(){
        return Camera.cameras[this._cameraIndex]
    }

    public get player(){
        return this._player
    }

    public get gameObjects(){
        return this._gameObjects.map(g => GameObject.gameObjects[g])
    }
}