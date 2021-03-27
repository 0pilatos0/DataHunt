import Canvas from "./Canvas.js"
import Event from "./Event.js"
import Sprite from "./Sprite.js"
import Vector2 from "./Vector2.js"
declare var window: any
export default class Tileset extends Event{
    static tiles: Array<Sprite> = []
    private _tiles2D: Array<Array<Sprite>> = []
    private _tiles: Array<Sprite> = []

    constructor(data: any){
        super()
        this.init(data)
    }

    private init(data: any){
        let imgPath: string, columns: number, rows: number, tileWidth: number, tileHeight: number
        let img = new Image()
        let onlyPath = typeof data == "string"
        imgPath = onlyPath ? data : data.image
        img.onload = () => {
            tileWidth = onlyPath ? window.spriteSize / window.spriteScaleFactor : data.tilewidth
            tileHeight = onlyPath ? window.spriteSize / window.spriteScaleFactor : data.tileheight
            rows = img.height / tileHeight
            columns = img.width / tileWidth
            let tileIndex: number = 0
            for (let y = 0; y < columns; y++) {
                this._tiles2D.push([])
                for (let x = 0; x < rows; x++) {
                    let canvas = new Canvas(new Vector2(tileWidth, tileHeight))
                    canvas.ctx.drawImage(img, -x * tileWidth, -y * tileHeight)
                    let spriteData = !onlyPath ? {offsetId: data.offsetId} : null
                    for (let i = 0; i < data?.tiles.length; i++) {
                        Object.assign(spriteData, (data.tiles[i].id == tileIndex ? data.tiles[i] : spriteData))
                    }
                    tileIndex++
                    new Sprite(canvas.element.toDataURL('image/png'), new Vector2(window.spriteSize, window.spriteSize), spriteData).on('load', (sprite: Sprite) => {
                        Tileset.tiles.push(sprite)
                        this._tiles.push(sprite)
                        this._tiles2D[y].push(sprite)
                        if(this._tiles.indexOf(sprite) + 1 == columns * rows) this.trigger('load', this)
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
        return this._tiles2D
    }
}