import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Image from "./Image.js";
import IDictionary from "./Interfaces/IDictionary.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class Tileset extends Event{
    public static tiles: IDictionary = []
    
    private _tiles: IDictionary = []
    private _rows: number = 0
    private _columns: number = 0

    constructor(data: any){
        super()
        new Image(data.image || data).on('load', (img: HTMLImageElement) => {
            let tileSize = new Vector2(Window.active.spriteSize / Window.active.spriteScaleFactor, Window.active.spriteSize / Window.active.spriteScaleFactor)
            this._columns = img.width / tileSize.x
            this._rows = img.height / tileSize.y
            let totalTiles: number = this._columns * this._rows
            this._tiles = new Array(totalTiles).fill(-1, 0, totalTiles)
            let offset: number = Tileset.tiles.length
            Tileset.tiles = Tileset.tiles.concat(new Array(totalTiles).fill(-1, 0, totalTiles))
            for (let t = 0; t < totalTiles; t++) {
                new Canvas(new Vector2(tileSize.x, tileSize.y), true).on('load', (canvas: Canvas) => {
                    canvas.drawImage(img, new Vector2(-(t%this._columns) * tileSize.x, -Math.floor(t/this._columns) * tileSize.y))
                    new Sprite(canvas.element.toDataURL('image/png')).on('load', (spriteIndex: number) => {
                        this._tiles[t] = {id:spriteIndex}
                        Tileset.tiles[offset + t] = {id:spriteIndex}
                        if(this._tiles.every((t: any) => t.id > -1)) {
                            for (let t = 0; t < totalTiles; t++) {
                                data.tiles?.map((tile: any) => {
                                    if(tile.id == t){
                                        let data: any = {}
                                        for (let a = 0; a < tile.animation?.length; a++) { 
                                            let anim = tile.animation[a]
                                            tile.animation[a] = {duration:anim.duration, id:this._tiles[anim.tileid].spriteIndex}
                                        }
                                        if(tile.animation) data.animation = tile.animation
                                        if(tile.properties){
                                            function getPropertyValueByName(name: string){
                                                return tile.properties.find((p: any) => {
                                                    if(p.name == name) return p
                                                }).value
                                            }
                                            data.colliderOffset = new Vector2(parseInt(getPropertyValueByName("x")) || 0, parseInt(getPropertyValueByName("y")) || 0)
                                            data.colliderSize = new Vector2(parseInt(getPropertyValueByName("width"))  || 0, parseInt(getPropertyValueByName("height")) || 0)
                                        }
                                        if(tile.type) data.colliderType = tile.type
                                        this._tiles[t] = Object.assign(this._tiles[t], data)
                                        Tileset.tiles[offset + t] = Object.assign(Tileset.tiles[offset + t], data)
                                    }
                                })
                                if(t == totalTiles - 1) this.trigger('load', this)
                            }
                        }
                    })
                })
            }
        })
    }

    get tiles(){
        return this._tiles
    }

    get tiles2D(){
        let rtn = []
        for (let y = 0; y < this._rows; y++) {
            rtn.push([])
            rtn[y] = this._tiles.slice(y*this._columns, ((y+1)*this._columns))
        }
        return rtn
    }
}