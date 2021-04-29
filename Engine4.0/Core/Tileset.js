import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Img from "./Img.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";
export default class Tileset extends Event {
    constructor(data) {
        super();
        this._tiles = [];
        this._rows = 0;
        this._columns = 0;
        new Img(data.image || data).on('load', (img) => {
            let tileWidth = Window.spriteSize / Window.spriteScaleFactor;
            let tileHeight = Window.spriteSize / Window.spriteScaleFactor;
            this._columns = img.width / tileWidth;
            this._rows = img.height / tileHeight;
            let totalTiles = this._columns * this._rows;
            this._tiles = new Array(totalTiles).fill(-1, 0, totalTiles);
            let offset = Tileset.tiles.length;
            Tileset.tiles = Tileset.tiles.concat(new Array(totalTiles).fill(-1, 0, totalTiles));
            for (let t = 0; t < totalTiles; t++) {
                new Canvas(new Vector2(tileWidth, tileHeight)).on('load', (canvas) => {
                    canvas.ctx.drawImage(img, -(t % this._columns) * tileWidth, -Math.floor(t / this._columns) * tileHeight);
                    new Sprite(canvas.element.toDataURL('image/png'), new Vector2(Window.spriteSize, Window.spriteSize)).on('load', (spriteIndex) => {
                        var _a;
                        this._tiles[t] = { id: spriteIndex };
                        Tileset.tiles[offset + t] = { id: spriteIndex };
                        if (this._tiles.every((t) => t.id > -1)) {
                            for (let t = 0; t < totalTiles; t++) {
                                (_a = data.tiles) === null || _a === void 0 ? void 0 : _a.map((tile) => {
                                    var _a;
                                    if (tile.id == t) {
                                        let data = {};
                                        for (let a = 0; a < ((_a = tile.animation) === null || _a === void 0 ? void 0 : _a.length); a++) {
                                            let anim = tile.animation[a];
                                            tile.animation[a] = { duration: anim.duration, id: this._tiles[anim.tileid].spriteIndex };
                                        }
                                        if (tile.animation)
                                            data.animation = tile.animation;
                                        if (tile.properties) {
                                            function getPropertyValueByName(name) {
                                                return tile.properties.find((p) => {
                                                    if (p.name == name)
                                                        return p;
                                                }).value;
                                            }
                                            data.colliderOffset = new Vector2(parseInt(getPropertyValueByName("x")) || 0, parseInt(getPropertyValueByName("y")) || 0);
                                            data.colliderSize = new Vector2(parseInt(getPropertyValueByName("width")) || 0, parseInt(getPropertyValueByName("height")) || 0);
                                        }
                                        if (tile.type)
                                            data.colliderType = tile.type;
                                        this._tiles[t] = Object.assign(this._tiles[t], data);
                                        Tileset.tiles[offset + t] = Object.assign(Tileset.tiles[offset + t], data);
                                    }
                                });
                                if (t == totalTiles - 1)
                                    this.trigger('load', this);
                            }
                        }
                    });
                });
            }
        });
    }
    get tiles() {
        return this._tiles;
    }
    get tiles2D() {
        let rtn = [];
        for (let y = 0; y < this._rows; y++) {
            rtn.push([]);
            rtn[y] = this._tiles.slice(y * this._columns, ((y + 1) * this._columns));
        }
        return rtn;
    }
}
Tileset.tiles = [];
