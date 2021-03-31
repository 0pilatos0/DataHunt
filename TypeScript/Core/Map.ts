import GameObjectType from "./Enums/GameObjectState.js"
import FileLoader from "./FileLoader.js"
import GameObject from "./GameObject.js"
import Sprite from "./Sprite.js"
import Tileset from "./Tileset.js"
import Transform from "./Transform.js"
import Vector2 from "./Vector2.js"
import Window from "./Window.js"

export default class Map extends Transform{
    public static maps: Array<Map> = []
    private static _activeMap: number = 0

    constructor(path: string){
        super(new Vector2(0, 0), new Vector2(0, 0))
        new FileLoader(path).on('load', (map: any) => {
            map = JSON.parse(map)
            let tilesetCount: number = 0
            for (let i = 0; i < map.tilesets.length; i++) {
                new FileLoader(path + `/../${map.tilesets[i].source}`).on('load', (tileset: any) => {
                    tileset = JSON.parse(tileset)
                    tileset.image = path + `/../${tileset.image}`
                    tileset.offsetId = map.tilesets[i].firstgid - 1
                    new Tileset(tileset).on('load', (tileset: Tileset) => {
                        tilesetCount++
                        if(tilesetCount == map.tilesets.length){
                            let gameObjectCount: number = 0
                            let totalGameObjectsCount: number = 0
                            for (let l = 0; l < map.layers.length; l++) {
                                let layer = map.layers[l]
                                switch(layer.type){
                                    case "tilelayer":
                                        totalGameObjectsCount += layer.data.length
                                        for (let y = 0; y < layer.data.length; y++) {
                                            let row = layer.data.splice(0, map.width)
                                            for (let x = 0; x < row.length; x++) {
                                                if(row[x] && row[x] != null){
                                                    let gameObject = new GameObject(new Vector2(x * Window.spriteSize, y * Window.spriteSize), new Vector2(Window.spriteSize, Window.spriteSize), tileset.tiles[row[x] - 1])
                                                    gameObject.on('load', (gameObject: GameObject) => {
                                                        gameObjectCount++
                                                        row[x] = gameObject
                                                    })
                                                }
                                                else{ row[x] = null; gameObjectCount++ }
                                            }
                                            layer.data.push(row)
                                        }
                                        break;
                                    case "objectgroup":
                                        totalGameObjectsCount += layer.objects.length
                                        for (let o = 0; o < layer.objects.length; o++) {
                                            let object = layer.objects[o]
                                            let type: GameObjectType
                                            switch(object.type){
                                                case "Spawnpoint":
                                                    type = GameObjectType.SPAWNPOINT
                                                    break;
                                                default: 
                                                    type = GameObjectType.DEFAULT
                                                    break;
                                            }
                                            new GameObject(new Vector2(object.x * Window.spriteScaleFactor, object.y * Window.spriteScaleFactor), new Vector2(object.width * Window.spriteScaleFactor, object.height * Window.spriteScaleFactor), undefined, type).on('load', (gameObject: GameObject) => {
                                                gameObjectCount++
                                                layer.objects[o] = gameObject
                                            })
                                        }
                                        break;
                                    default: break;
                                }
                            }
                            let interval = setInterval(() => {
                                if(gameObjectCount == totalGameObjectsCount){
                                    clearInterval(interval)
                                    this.size.x = map.width * Window.spriteSize
                                    this.size.y = map.height * Window.spriteSize
                                    Map.maps.push(this)
                                    this.trigger('load', this)
                                }
                            }, 100)
                        }
                    })
                })
            }
        })
    }

    get bounds(){
        return {
            left: this.position.x,
            top: this.position.y,
            right: this.position.x + this.size.x,
            bottom: this.position.y + this.size.y
        }
    }

    public static get active(){
        return Map.maps[Map._activeMap]
    }
}