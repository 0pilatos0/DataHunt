import GameObjectType from "./Enums/GameObjectType.js";
import FileLoader from "./FileLoader.js";
import GameObject from "./GameObject.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class Map extends Transform{
    public static maps: Array<Map> = []
    private static _activeMap: number = 0

    constructor(){
        super(new Vector2(0, 0), new Vector2(0, 0))
        new FileLoader('/Engine4.0/Maps/Main/Map.json').on('load', (map: any) => {
            for (let t = 0; t < map.tilesets.length; t++) {
                new FileLoader(`/Engine4.0/Maps/Main/${map.tilesets[t].source}`).on('load', (tileset: any) => {
                    tileset.image = `/Engine4.0/Maps/Main/${tileset.image}`
                    new Tileset(tileset).on('load', (tileset: Tileset) => {
                        if(t == map.tilesets.length - 1){
                            let totalGameObjectsCount: number = 0
                            for (let l = 0; l < map.layers.length; l++) {
                                switch(map.layers[l].type){
                                    case "tilelayer":
                                        totalGameObjectsCount += map.layers[l].data.length
                                        for (let y = 0; y < map.layers[l].data.length; y++) {
                                            let row = map.layers[l].data.splice(0, map.width)
                                            for (let x = 0; x < row.length; x++) {
                                                if(row[x]){
                                                    new GameObject(new Vector2(x * Window.spriteSize, y * Window.spriteSize), new Vector2(Window.spriteSize, Window.spriteSize), Tileset.tiles[row[x] - 1]).on('load', (gameObject: GameObject) => {
                                                        row[x] = gameObject
                                                        if(GameObject.gameObjects.length == totalGameObjectsCount) {
                                                            Map.maps.push(this)
                                                            this.trigger('load', this)
                                                        }
                                                    })
                                                }
                                                else totalGameObjectsCount--
                                            }
                                            map.layers[l].data.push(row)
                                        }
                                        break
                                    case "objectgroup":
                                        totalGameObjectsCount += map.layers[l].objects.length
                                        for (let o = 0; o < map.layers[l].objects.length; o++) {
                                            let object = map.layers[l].objects[o]
                                            let type: GameObjectType
                                            switch(object.type){
                                                case "Spawnpoint":
                                                    type = GameObjectType.SPAWNPOINT
                                                    break
                                                default:
                                                    type = GameObjectType.DEFAULT
                                                    break
                                            }
                                            new GameObject(new Vector2(object.x * Window.spriteScaleFactor, object.y * Window.spriteScaleFactor), new Vector2(object.width * Window.spriteScaleFactor, object.height * Window.spriteScaleFactor), -1, type).on('load', (gameObject: GameObject) => {
                                                map.layers[l].objects[o] = gameObject
                                                if(GameObject.gameObjects.length == totalGameObjectsCount) {
                                                    Map.maps.push(this)
                                                    this.trigger('load', this)
                                                }
                                            })
                                        }
                                        break
                                    default:
                                        break
                                }  
                            }
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