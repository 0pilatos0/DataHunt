import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";
export default class Tileset extends Event {
    constructor(data) {
        super();
        this._tiles = [];
        this._columns = 0;
        this._rows = 0;
        this.init(data);
    }
    init(data) {
        let imgPath, tileWidth, tileHeight;
        let img = new Image();
        let onlyPath = typeof data == "string";
        imgPath = onlyPath ? data : data.image;
        img.onload = () => {
            var _a;
            tileWidth = onlyPath ? Window.spriteSize / Window.spriteScaleFactor : data.tilewidth;
            tileHeight = onlyPath ? Window.spriteSize / Window.spriteScaleFactor : data.tileheight;
            this._rows = img.height / tileHeight;
            this._columns = img.width / tileWidth;
            let totalTiles = this._columns * this._rows;
            this._tiles.fill(-1, 0, totalTiles);
            let doneTiles = 0;
            for (let i = 0; i < totalTiles; i++) {
                let canvas = new Canvas(new Vector2(tileWidth, tileHeight));
                canvas.ctx.drawImage(img, -(i % this._columns) * tileWidth, -Math.floor(i / this._columns) * tileHeight);
                let spriteData = !onlyPath ? { offsetId: data.offsetId } : {};
                for (let j = 0; j < ((_a = data === null || data === void 0 ? void 0 : data.tiles) === null || _a === void 0 ? void 0 : _a.length); j++) {
                    Object.assign(spriteData, (data.tiles[j].id == i ? data.tiles[j] : spriteData));
                }
                new Sprite(canvas.element.toDataURL('image/png'), new Vector2(Window.spriteSize, Window.spriteSize), spriteData, this).on('load', (spriteIndex) => {
                    this._tiles[i] = spriteIndex;
                    doneTiles++;
                    if (doneTiles == totalTiles) {
                        this.trigger('load', this);
                    }
                });
            }
        };
        img.src = imgPath;
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
Tileset.tilesets = [];
