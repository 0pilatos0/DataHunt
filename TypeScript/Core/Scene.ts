import Player from "../GameObjects/Player.js"
import Camera from "./Camera.js"
import GameObjectType from "./Enums/GameObjectState.js"
import Event from "./Event.js"
import GameObject from "./GameObject.js"
import Map from "./Map.js"
import Vector2 from "./Vector2.js"
import Window from "./Window.js"

export default class Scene extends Event{
    public static scenes: Array<Scene> = []
    private static _activeScene: number = 0

    private _camera: Camera = new Camera(new Vector2(0, 0), new Vector2(0, 0))
    private _visibleGameObjects: Array<GameObject> = []
    private _player: Player | null = null

    constructor(){
        super()
        this.init()
    }

    private init(){
        Scene.scenes.push(this)
        new Map('/Engine3.0/Maps/Main/Map.json').on('load', (map: Map) => {
            //this._map = map
            
            let playerPos = GameObject.getByType(GameObjectType.SPAWNPOINT)[Math.floor(Math.random() * GameObject.getByType(GameObjectType.SPAWNPOINT).length)].position
            new Player(playerPos, new Vector2(Window.spriteSize, Window.spriteSize), true).on('load', (player: Player) => {
                this._player = player
                this.trigger('load', this)
            })
        })
    }

    public static get active(){
        return Scene.scenes[Scene._activeScene]
    }

    get camera(){
        return this._camera
    }

    public render(ctx: CanvasRenderingContext2D){
        for (let i = 0; i < this._visibleGameObjects.length; i++) {
            let gameObject = this._visibleGameObjects[i]
            gameObject.render(ctx)
        }
    }

    public update(){
        this._visibleGameObjects = []
        GameObject.gameObjects.map(g => {
            if(g.position.x <= this._camera.position.x + this._camera.size.x &&
                g.position.y <= this._camera.position.y + this._camera.size.y &&
                g.position.x >= this._camera.position.x &&
                g.position.y >= this._camera.position.y
            ) {
                this._visibleGameObjects.push(g)
                g.update()
            }
        })
    }
}