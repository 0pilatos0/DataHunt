import GameObjectType from "./Enums/GameObjectType.js";
import FileLoader from "./FileLoader.js";
import GameObject from "./GameObject.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class Map extends Transform{
    public static maps: Array<Map> = []

    constructor(path: String = '/Maps/Main/') {
        super(new Vector2(0, 0), new Vector2(0, 0))
        new FileLoader(`${path}Map.json`).on('load', (map: any) => {
            let t = -1
            let createTileset = (t: number) => {
                t++
                new FileLoader(`${path}${map.tilesets[t].source}`).on('load', (tileset: any) => {
                    tileset.image = `${path}${tileset.image}`
                    new Tileset(tileset).on('load', (tileset: Tileset) => {
                        if(t < map.tilesets.length - 1) createTileset(t)
                        if(t == map.tilesets.length - 1){
                            let totalGameObjects: number = 0
                            let counter: number = 0
                            map.layers.map((l: any) => {
                                switch (l.type) {
                                    case "tilelayer":
                                        totalGameObjects += l.data.length
                                        for (let y = 0; y < l.data.length; y++) {
                                            let row = l.data.splice(0, map.width)
                                            for (let x = 0; x < row.length; x++) {
                                                if(row[x]){
                                                    new GameObject(new Vector2(x * Window.active.spriteSize, y * Window.active.spriteSize), new Vector2(Window.active.spriteSize, Window.active.spriteSize), Tileset.tiles[row[x] - 1], GameObjectType.DEFAULT, true).on('load', (gameObject: GameObject) => {
                                                        gameObject.layer = map.layers.indexOf(l)
                                                        counter++
                                                        if(counter == totalGameObjects) {
                                                            row[x] = gameObject
                                                            Map.maps.push(this)
                                                            this.size = new Vector2(map.width * Window.active.spriteSize, map.height * Window.active.spriteSize)
                                                            this.trigger('load', Map.maps.indexOf(this))
                                                        }
                                                    })
                                                }
                                                else{
                                                    totalGameObjects--
                                                    if(counter == totalGameObjects) {
                                                        Map.maps.push(this)
                                                        this.size = new Vector2(map.width * Window.active.spriteSize, map.height * Window.active.spriteSize)
                                                        this.trigger('load', Map.maps.indexOf(this))
                                                    }
                                                } 
                                            }
                                            l.data.push(row)
                                        }
                                        break
                                    case "objectgroup":
                                        totalGameObjects += l.objects.length
                                        l.objects.map((o: any) => {
                                            let type: GameObjectType
                                            switch(o.type){
                                                case "Spawnpoint":
                                                    type = GameObjectType.SPAWNPOINT
                                                    break
                                                default:
                                                    type = GameObjectType.DEFAULT
                                                    break
                                            }
                                            new GameObject(new Vector2(o.x * Window.active.spriteScaleFactor, o.y * Window.active.spriteScaleFactor), new Vector2(o.width * Window.active.spriteScaleFactor, o.height * Window.active.spriteScaleFactor), undefined, type, true).on('load', (gameObject: GameObject) => {
                                                l.objects[l.objects.indexOf(o)] = gameObject
                                                gameObject.layer = map.layers.indexOf(l)
                                                counter++
                                                if(counter == totalGameObjects) {
                                                    Map.maps.push(this)
                                                    this.size = new Vector2(map.width * Window.active.spriteSize, map.height * Window.active.spriteSize)
                                                    this.trigger('load', Map.maps.indexOf(this))
                                                }
                                            })
                                        })
                                        break
                                    default:
                                        break
                                }
                            })
                        }
                    })
                })
            }
            createTileset(t)
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
}