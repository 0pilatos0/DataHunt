import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Img from "./Img.js";
import IDictionary from "./Interfaces/IDictionary.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
import Window from "./Window.js";

export default class Tileset extends Event{
    public static tiles: Array<IDictionary>  = []
    private _tiles: Array<IDictionary> = []

    constructor(data: string | any){
        super()
        new Img(data.image).on('load', (img: HTMLImageElement) => {
            let tileWidth: number = Window.spriteSize / Window.spriteScaleFactor
            let tileHeight: number = Window.spriteSize / Window.spriteScaleFactor
            let columns: number = img.width / tileWidth
            let rows: number = img.height / tileHeight
            let totalTiles: number = columns * rows
            this._tiles = new Array(totalTiles).fill(-1, 0, totalTiles)
            let offset: number = Tileset.tiles.length
            Tileset.tiles = Tileset.tiles.concat(new Array(totalTiles).fill(-1, 0, totalTiles))
            for (let t = 0; t < totalTiles; t++) {
                new Canvas(new Vector2(tileWidth, tileHeight)).on('load', (canvas: Canvas) => {
                    canvas.ctx.drawImage(img, -(t%columns) * tileWidth, -Math.floor(t/columns) * tileHeight)
                    new Sprite(canvas.element.toDataURL('image/png'), new Vector2(Window.spriteSize, Window.spriteSize)).on('load', (spriteIndex: number) => {
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
}
