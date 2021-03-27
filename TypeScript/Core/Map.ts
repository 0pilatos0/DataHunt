import Event from "./Event.js"
import FileLoader from "./FileLoader.js"
import GameObject from "./GameObject.js"
import Tileset from "./Tileset.js"
import Vector2 from "./Vector2.js"
declare var window: any
export default class Map extends Event{
    private mapAreaToDraw: Array<Array<Array<GameObject>>> = []
    private map: any

    constructor(path: string){
        super()
        this.init(path)
    }

    private init(path: string){
        new FileLoader(path).on('load', (map: any) => {
            map = JSON.parse(map)
            for (let i = 0; i < map.tilesets.length; i++) {
                new FileLoader(path + `/../${map.tilesets[i].source}`).on('load', (tileset: any) => {
                    tileset = JSON.parse(tileset)
                    tileset.image = path + `/../${tileset.image}`
                    tileset.offsetId = map.tilesets[i].firstgid - 1
                    new Tileset(tileset).on('load', (tileset: Tileset) => {
                        if(i == map.tilesets.length - 1){
                            for (let l = 0; l < map.layers.length; l++) {
                                let layer = map.layers[l]
                                switch(layer.type){
                                    case "tilelayer":
                                        for (let y = 0; y < layer.data.length; y++) {
                                            let row = layer.data.splice(0, map.width)
                                            for (let x = 0; x < row.length; x++) {
                                                if(row[x] && row[x] != null) row[x] = new GameObject(new Vector2(y * window.spriteSize, x * window.spriteSize), new Vector2(window.spriteSize, window.spriteSize), Tileset.tiles[row[x]])
                                                else row[x] = null
                                            }
                                            layer.data.push(row)
                                        }
                                        break;
                                    case "objectgroup":
                                        for (let o = 0; o < layer.objects.length; o++) {
                                            let object = layer.objects[o]
                                            layer.objects[o] = new GameObject(new Vector2(object.x, object.y), new Vector2(object.width * window.spriteScaleFactor, object.height * window.spriteScaleFactor), undefined)
                                        }
                                        break;
                                    default: break;
                                }
                                if(l == map.layers.length - 1){
                                    window.mapBoundX = map.width * window.spriteSize
                                    window.mapBoundY = map.height * window.spriteSize
                                    this.map = map
                                    this.trigger('load')
                                }
                            }
                        }
                    })
                })
            }
        })
    }

    public render(ctx: CanvasRenderingContext2D){
        for (let l = 0; l < this.mapAreaToDraw.length; l++) {
            for (let y = 0; y < this.mapAreaToDraw[l].length; y++) {
                for (let x = 0; x < this.mapAreaToDraw[l][y].length; x++) {
                    if(this.mapAreaToDraw[l][y][x]?.visible && this.mapAreaToDraw[l][y][x]?.sprite) ctx.drawImage(this.mapAreaToDraw[l][y][x]?.sprite.sprite, x * window.spriteSize - window.mapOffsetX - window.displayWidth / 2, y * window.spriteSize - window.mapOffsetY - window.displayHeight / 2)
                }
            }
        }
    }

    public update(){
        window.mapOffsetX = 0
        window.mapOffsetY = 0
        for (let l = 0; l < this.map.layers.length; l++) {
            if(!this.mapAreaToDraw[l]) this.mapAreaToDraw.push([])
            for (let y = 0; y < window.maxSpritesY; y++) {
                if(!this.mapAreaToDraw[l][y]) this.mapAreaToDraw[l].push([])
                let posY: number = y
                if(window.player.position.y + window.player.size.y / 2 >= window.displayHeight / 2 && window.player.position.y + window.player.size.y / 2 < window.mapBoundY - window.displayHeight / 2){
                    window.mapOffsetY = (window.player.position.y + window.player.size.y / 2 - window.displayHeight / 2) % window.spriteSize
                    posY += Math.floor((window.player.position.y + window.player.size.y / 2 - window.displayHeight / 2) / window.spriteSize)
                }
                else if(window.player.position.y + window.player.size.y / 2 >= window.mapBoundY - window.displayHeight / 2){
                    posY += this.map[l].tiles.length - Math.round(window.displayHeight / window.spriteSize)
                }
                if(posY < 0) posY = 0
                if(posY >= this.map[l].tiles.length - 1) posY = this.map[l].tiles.length - 1
                for (let x = 0; x < window.maxSpritesX; x++) {
                    let posX: number = x
                    if(window.player.position.x + window.player.size.x / 2 >= window.displayWidth / 2 && window.player.position.x + window.player.size.x / 2 < window.mapBoundX - window.displayWidth / 2){
                        window.mapOffsetX = (window.player.position.x + window.player.size.x / 2 - window.displayWidth / 2) % window.spriteSize
                        posX += Math.floor((window.player.position.x + window.player.size.x / 2 - window.displayWidth / 2) / window.spriteSize)
                    }
                    else if(window.player.position.x + window.player.size.x / 2 >= window.mapBoundX - window.displayWidth / 2){
                        posX += this.map[l].tiles[posY].length - Math.round(window.displayWidth / window.spriteSize)
                    }
                    if(posX < 0) posX = 0
                    if(posX >=this.map[l].tiles[posY].length - 1) posX = this.map[l].tiles[posY].length - 1
                    this.mapAreaToDraw[l][y][x] = this.map[l].tiles[posY][posX]
                }
            }
        }
    }
}