import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
export default class Tileset extends Event {
    constructor(data) {
        super();
        this._tiles2D = [];
        this._tiles = [];
        this.init(data);
    }
    init(data) {
        let imgPath, columns, rows, tileWidth, tileHeight;
        let img = new Image();
        let onlyPath = typeof data == "string";
        imgPath = onlyPath ? data : data.image;
        img.onload = () => {
            var _a;
            tileWidth = onlyPath ? window.spriteSize / window.spriteScaleFactor : data.tilewidth;
            tileHeight = onlyPath ? window.spriteSize / window.spriteScaleFactor : data.tileheight;
            rows = img.height / tileHeight;
            columns = img.width / tileWidth;
            let tileIndex = 0;
            for (let y = 0; y < rows; y++) {
                this._tiles2D.push([]);
                for (let x = 0; x < columns; x++) {
                    let canvas = new Canvas(new Vector2(tileWidth, tileHeight));
                    canvas.ctx.drawImage(img, -x * tileWidth, -y * tileHeight);
                    let spriteData = !onlyPath ? { offsetId: data.offsetId } : null;
                    for (let i = 0; i < ((_a = data === null || data === void 0 ? void 0 : data.tiles) === null || _a === void 0 ? void 0 : _a.length); i++) {
                        Object.assign(spriteData, (data.tiles[i].id == tileIndex ? data.tiles[i] : spriteData));
                    }
                    tileIndex++;
                    new Sprite(canvas.element.toDataURL('image/png'), new Vector2(window.spriteSize, window.spriteSize), spriteData).on('load', (sprite) => {
                        Tileset.tiles.push(sprite);
                        this._tiles.push(sprite);
                        this._tiles2D[y].push(sprite);
                        if (this._tiles.indexOf(sprite) + 1 == columns * rows)
                            this.trigger('load', this);
                    });
                }
            }
        };
        img.src = imgPath;
    }
    get tiles() {
        return this._tiles;
    }
    get tiles2D() {
        return this._tiles2D;
    }
}
Tileset.tiles = [];
