import Canvas from "./Canvas.js"
import Event from "./Event.js"
import Sprite from "./Sprite.js"
import Vector2 from "./Vector2.js"
declare var window: any
export default class Tileset extends Event{
    static tiles: Array<Sprite> = []
    private _tiles: Array<Sprite> = []
    private _columns: number = 0
    private _rows: number = 0

    constructor(data: any){
        super()
        this.init(data)
    }

    private init(data: any){
        let imgPath: string, tileWidth: number, tileHeight: number
        let img = new Image()
        let onlyPath = typeof data == "string"
        imgPath = onlyPath ? data : data.image
        img.onload = () => {
            tileWidth = onlyPath ? window.spriteSize / window.spriteScaleFactor : data.tilewidth
            tileHeight = onlyPath ? window.spriteSize / window.spriteScaleFactor : data.tileheight
            this._rows = img.height / tileHeight
            this._columns = img.width / tileWidth
            let tileIndex: number = 0
            for (let y = 0; y < this._rows; y++) {
                for (let x = 0; x < this._columns; x++) {
                    let canvas = new Canvas(new Vector2(tileWidth, tileHeight))
                    canvas.ctx.drawImage(img, -x * tileWidth, -y * tileHeight)
                    let spriteData = !onlyPath ? {offsetId: data.offsetId} : null
                    for (let i = 0; i < data?.tiles?.length; i++) {
                        Object.assign(spriteData, (data.tiles[i].id == tileIndex ? data.tiles[i] : spriteData))
                    }
                    tileIndex++
                    new Sprite(canvas.element.toDataURL('image/png'), new Vector2(window.spriteSize, window.spriteSize), spriteData).on('load', (sprite: Sprite) => {
                        Tileset.tiles.push(sprite)
                        this._tiles.push(sprite)
                        if(this._tiles.indexOf(sprite) + 1 == this._columns * this._rows) this.trigger('load', this)
                    })
                }
            }
        }
        img.src = imgPath
    }

    get tiles(){
        return this._tiles
    }

    get tiles2D(){
        let rtn = []
        for (let y = 0; y < this._columns; y++) {
            rtn.push([])
            for (let x = 0; x < this._rows; x++) {
                rtn[y] = this._tiles.splice(0, this._columns)
            }
        }
        return rtn
    }
}