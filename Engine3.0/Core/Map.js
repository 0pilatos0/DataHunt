import FileLoader from "./FileLoader.js";
import GameObject from "./GameObject.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";
export default class Map extends Transform {
    constructor(path) {
        super(new Vector2(0, 0), new Vector2(0, 0));
        new FileLoader(path).on('load', (map) => {
            map = JSON.parse(map);
            let tilesetCount = 0;
            let tilesetSprites = [];
            for (let i = 0; i < map.tilesets.length; i++) {
                new FileLoader(path + `/../${map.tilesets[i].source}`).on('load', (tileset) => {
                    tileset = JSON.parse(tileset);
                    tileset.image = path + `/../${tileset.image}`;
                    tileset.offsetId = map.tilesets[i].firstgid - 1;
                    new Tileset(tileset).on('load', (tileset) => {
                        tilesetSprites = tilesetSprites.concat(tileset.tiles);
                        tilesetCount++;
                        if (tilesetCount == map.tilesets.length) {
                            let gameObjectCount = 0;
                            let totalGameObjectsCount = 0;
                            for (let l = 0; l < map.layers.length; l++) {
                                let layer = map.layers[l];
                                switch (layer.type) {
                                    case "tilelayer":
                                        totalGameObjectsCount += layer.data.length;
                                        for (let y = 0; y < layer.data.length; y++) {
                                            let row = layer.data.splice(0, map.width);
                                            for (let x = 0; x < row.length; x++) {
                                                if (row[x] && row[x] != null) {
                                                    let gameObject = new GameObject(new Vector2(x * Window.spriteSize, y * Window.spriteSize), new Vector2(Window.spriteSize, Window.spriteSize), tilesetSprites[row[x] - 1]);
                                                    gameObject.on('load', (gameObject) => {
                                                        gameObjectCount++;
                                                        row[x] = gameObject;
                                                        gameObject.layer = l;
                                                    });
                                                }
                                                else {
                                                    row[x] = null;
                                                    gameObjectCount++;
                                                }
                                            }
                                            layer.data.push(row);
                                        }
                                        break;
                                    case "objectgroup":
                                        totalGameObjectsCount += layer.objects.length;
                                        for (let o = 0; o < layer.objects.length; o++) {
                                            let object = layer.objects[o];
                                            let type;
                                            switch (object.type) {
                                                case "Spawnpoint":
                                                    type = 1 /* SPAWNPOINT */;
                                                    break;
                                                default:
                                                    type = 0 /* DEFAULT */;
                                                    break;
                                            }
                                            new GameObject(new Vector2(object.x * Window.spriteScaleFactor, object.y * Window.spriteScaleFactor), new Vector2(object.width * Window.spriteScaleFactor, object.height * Window.spriteScaleFactor), undefined, type).on('load', (gameObject) => {
                                                gameObjectCount++;
                                                layer.objects[o] = gameObject;
                                                gameObject.layer = l;
                                            });
                                        }
                                        break;
                                    default: break;
                                }
                            }
                            let interval = setInterval(() => {
                                if (gameObjectCount == totalGameObjectsCount) {
                                    console.log(tilesetSprites);
                                    clearInterval(interval);
                                    this.size.x = map.width * Window.spriteSize;
                                    this.size.y = map.height * Window.spriteSize;
                                    Map.maps.push(this);
                                    this.trigger('load', this);
                                }
                            }, 100);
                        }
                    });
                });
            }
        });
    }
    get bounds() {
        return {
            left: this.position.x,
            top: this.position.y,
            right: this.position.x + this.size.x,
            bottom: this.position.y + this.size.y
        };
    }
    static get active() {
        return Map.maps[Map._activeMap];
    }
}
Map.maps = [];
Map._activeMap = 0;
