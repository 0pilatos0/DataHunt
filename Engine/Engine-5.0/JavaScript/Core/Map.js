import JSONLoader from "./FileLoaders/JSONLoader.js";
import GameObject from "./GameObject.js";
import Tileset from "./Tileset.js";
import Transform from "./Transform.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";
export default class Map extends Transform {
    /**
     * Creates a new map
     * @param path
     */
    constructor(path = '/Engine-5.0/JavaScript/Maps/Main/') {
        super(new Vector2(0, 0), new Vector2(0, 0));
        this.gameObjectCounter = 0;
        this.totalGameObjectsCounter = 0;
        this.path = '';
        this.path = path;
        this.loadMapData();
    }
    /**
     * Returns the boundaries of the map
     */
    get bounds() {
        return {
            left: this.position.x,
            top: this.position.y,
            right: this.position.x + this.size.x,
            bottom: this.position.y + this.size.y
        };
    }
    /**
     * Creates a new GameObject for the map
     * @param position
     * @param size
     * @param type
     * @param layer
     * @param object
     */
    createGameObject(position, size, data, type, layer) {
        new GameObject(position, size, data, type, true).on('load', (gameObject) => {
            gameObject.layer = this.map.layers.indexOf(layer);
            this.gameObjectCounter++;
            this.checkIfEnoughObjects();
        });
    }
    /**
     * Checks if all GameObjects are generated. If so it launches the event so it is done
     */
    checkIfEnoughObjects() {
        if (this.gameObjectCounter == this.totalGameObjectsCounter) {
            Map.maps.push(this);
            this.size = new Vector2(this.map.width * Window.active.spriteSize, this.map.height * Window.active.spriteSize);
            this.trigger('load', Map.maps.indexOf(this));
        }
    }
    /**
     * Loads the default mapdata
     */
    loadMapData() {
        new JSONLoader(`${this.path}Map.json`).on('load', (map) => {
            this.map = map;
            this.createTileset();
        });
    }
    /**
     * Creates an tileset with an index
     * It's default -1 because it increase the number each call at the start
     * @param index
     */
    createTileset(index = -1) {
        index++;
        new JSONLoader(`${this.path}${this.map.tilesets[index].source}`).on('load', (tileset) => {
            tileset.image = `${this.path}${tileset.image}`;
            new Tileset(tileset).on('load', (tileset) => {
                if (index < this.map.tilesets.length - 1)
                    this.createTileset(index);
                if (index == this.map.tilesets.length - 1) {
                    this.map.layers.map((layer) => {
                        this.createLayer(layer);
                    });
                }
            });
        });
    }
    /**
     * Creates the layers with tiles of the map
     * @param layer
     */
    createLayer(layer) {
        switch (layer.type) {
            case "tilelayer":
                this.totalGameObjectsCounter += layer.data.length;
                for (let y = 0; y < layer.data.length; y++) {
                    let tiles = layer.data.splice(0, this.map.width);
                    for (let x = 0; x < tiles.length; x++) {
                        if (tiles[x]) {
                            this.createGameObject(new Vector2(x * Window.active.spriteSize, y * Window.active.spriteSize), new Vector2(Window.active.spriteSize, Window.active.spriteSize), Tileset.tiles[tiles[x] - 1], 0 /* DEFAULT */, layer);
                        }
                        else {
                            this.gameObjectCounter++;
                            this.checkIfEnoughObjects();
                        }
                    }
                    layer.data.push(tiles);
                }
                break;
            case "objectgroup":
                this.totalGameObjectsCounter += layer.objects.length;
                layer.objects.map((object) => {
                    let type;
                    switch (object.type) {
                        case "Spawnpoint":
                            type = 1 /* SPAWNPOINT */;
                            break;
                        default:
                            type = 0 /* DEFAULT */;
                            break;
                    }
                    this.createGameObject(new Vector2(object.x * Window.active.spriteScaleFactor, object.y * Window.active.spriteScaleFactor), new Vector2(object.width * Window.active.spriteScaleFactor, object.height * Window.active.spriteScaleFactor), undefined, type, layer);
                });
                break;
            default:
                break;
        }
    }
}
Map.maps = [];
