import FileLoader from "./FileLoader.js";
import Tileset from "./Tileset.js";
export default class Map {
    constructor() {
        new FileLoader('/Engine4.0/Maps/Main/Map.json').on('load', (map) => {
            for (let t = 0; t < map.tilesets.length; t++) {
                new FileLoader(`/Engine4.0/Maps/Main/${map.tilesets[t].source}`).on('load', (tileset) => {
                    tileset.image = `/Engine4.0/Maps/Main/${tileset.image}`;
                    new Tileset(tileset).on('load', (tileset) => {
                        if (t == map.tilesets.length - 1) {
                            console.log(Tileset.tiles);
                            for (let l = 0; l < map.layers.length; l++) {
                                console.log(map.layers[l]);
                                switch (map.layers[l].type) {
                                    case "tilelayer":
                                        for (let y = 0; y < map.layers[l].data.length; y++) {
                                            let row = map.layers[l].data.splice(0, map.width);
                                            for (let x = 0; x < row.length; x++) {
                                                if (row[x]) {
                                                    //TODO create the actual gameobject
                                                }
                                            }
                                            map.layers[l].data.push(row);
                                        }
                                        break;
                                    case "objectgroup":
                                        for (let o = 0; o < map.layers[l].objects.length; o++) {
                                            console.log(map.layers[l].objects[o]);
                                            //TODO create the actual gameobject
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    });
                });
            }
        });
    }
}
