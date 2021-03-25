import { Player } from "../GameObjects/Player.js"
import { Events } from "./Event.js"
import { FileLoader } from "./FileLoader.js"
import { GameObject } from "./GameObject.js"
import { CustomImage, Sprite } from "./Sprite.js"
import { Vector2 } from "./Vector2.js"

export class Map extends Events{
    #map
    #tilesets = []
    #tiles = [null]
    #customMap
    #mapAreaToDraw = []
    #objects = []
    constructor(){
        super()
        this.#init()
    }

    #init = () => {
        window.map = this
        let path = '/Engine2.0/Maps/Main/Map.json'
        let mapData = new FileLoader(path)
        mapData.on('load', (data) => {
            this.#map = eval(`(${data})`)
            let amount = 0
            for (let i = 0; i < this.#map.tilesets.length; i++) {
                let tileset = this.#map.tilesets[i]
                let tilesetLoader = new FileLoader(`/Engine2.0/Maps/Main/${tileset.source}`)
                tilesetLoader.on('load', (tilesetData) => {
                    this.#map.tilesets[i] = {tileset:JSON.parse(tilesetData),tileOffset:tileset.firstgid - 1}
                    this.#map.tilesets[i].tileset.image = `/Engine2.0/Maps/Main/${this.#map.tilesets[i].tileset.image}`
                    amount++
                    if(amount == this.#map.tilesets.length) this.#loadTilemaps()
                })
            }
        })
    }

    #loadTilemaps = async () => {
        let successCount = 0
        let errorCount = 0
        for (let i = 0; i < this.#map.tilesets.length; i++) {
            new CustomImage(this.#map.tilesets[i].tileset.image).on('load', (img) => {
                successCount++
                this.#tilesets[i] = {img,tileOffset:this.#map.tilesets[i].tileOffset}
                successCount + errorCount == this.#map.tilesets.length ? this.#seperateTilesOfTilemaps() : false
            })
            // errorCount++
            // console.log(`Failed loading ${this.#map.tilesets[i].tileset.image}`)
        }
    }

    #seperateTilesOfTilemaps = async () => {
        let amount = 0
        let spriteIndex = 0
        let totalSprites = 0
        for (let i = 0; i < this.#tilesets.length; i++) {
            let tileset = this.#tilesets[i]
            let tileColumns = tileset.img.width / this.#map.tilewidth
            let tileRows = tileset.img.height / this.#map.tileheight
            totalSprites += tileRows * tileColumns
            for (let y = 0; y < tileRows; y++) {
                for (let x = 0; x < tileColumns; x++) {
                    let tileCanvas = document.createElement('canvas')
                    let tileContext = tileCanvas.getContext('2d')
                    tileCanvas.width = this.#map.tilewidth
                    tileCanvas.height = this.#map.tileheight
                    tileContext.drawImage(tileset.img, -x * this.#map.tilewidth, -y * this.#map.tileheight)
                    let data = null
                    for (let j = 0; j < this.#map.tilesets[i].tileset.tiles.length; j++) {
                        if(spriteIndex == this.#map.tilesets[i].tileset.tiles[j].id + this.#tilesets[i].tileOffset){
                            data = this.#map.tilesets[i].tileset.tiles[j]
                            data.tileOffset = this.#tilesets[i].tileOffset
                        }
                    }
                    spriteIndex++
                    new Sprite(tileCanvas.toDataURL('image/png'), data).on('load', (sprite) => {
                        this.#tiles.push(sprite)
                        amount++
                        if(amount == totalSprites) {window.tiles = this.#tiles; this.#generateMap()}
                    })
                }
            }
        }
    }

    #generateMap = async () => {
        this.#customMap = []
        new Player(new Vector2(0, 0), new Vector2(window.spriteSize, window.spriteSize), new Sprite("/Engine2.0/Sprites/Players/Player1.png"), true)
        for (let i = 0; i < this.#map.layers.length; i++) {
            let layer = this.#map.layers[i]
            switch (layer.type) {
                case "tilelayer":
                    this.#customMap.push(new Array)
                    for (let j = 0; j < this.#map.layers[i].data.length; j++) {
                        let row = this.#map.layers[i].data.splice(0, this.#map.width)
                        for (let x = 0; x < row.length; x++) {
                            if(row[x] != null && row[x]) row[x] = new GameObject(new Vector2(x * window.spriteSize, j * window.spriteSize), new Vector2(window.spriteSize, window.spriteSize), this.#tiles[row[x]], this.#tiles[row[x]]?.type)
                            else row[x] = null
                        }
                        this.#customMap[this.#customMap.length-1].push(row)
                    }
                    break;
                case "objectgroup":
                    for (let j = 0; j < layer.objects.length; j++) {
                        let object = layer.objects[i]
                        new GameObject(new Vector2(object.x, object.y), new Vector2(object.width * window.spriteFactor, object.height * window.spriteFactor), null, object.type)
                        //TODO make spawnpoint work
                    }
                    console.log(window.gameObjects)
                    break;
                default:
                    break;
            }
        }
        window.mapBoundX = this.#map.width * window.spriteSize
        window.mapBoundY = this.#map.height * window.spriteSize
        console.log(this.#customMap)
        this.trigger('load', window.player)
    }

    render(ctx){
        for (let i = 0; i < this.#mapAreaToDraw.length; i++) {
            for (let y = 0; y < this.#mapAreaToDraw[i].length; y++) {
                for (let x = 0; x < this.#mapAreaToDraw[i][y].length; x++) {
                    if(this.#mapAreaToDraw[i][y][x]?.visible && this.#mapAreaToDraw[i][y][x]?.sprite?.sprite) ctx.drawImage(this.#mapAreaToDraw[i][y][x]?.sprite.sprite, x * window.spriteSize - window.mapOffsetX - window.displayWidth / 2, y * window.spriteSize - window.mapOffsetY - window.displayHeight / 2)
                }
            }
        }
    }

    update(){
        window.mapOffsetX = 0
        window.mapOffsetY = 0
        if(!this.#customMap) return
        for (let i = 0; i < this.#customMap.length; i++) {
            if(!this.#mapAreaToDraw[i]) this.#mapAreaToDraw.push(new Array)
            for (let y = 0; y < window.maxSpritesY; y++) {
                if(!this.#mapAreaToDraw[i][y]) this.#mapAreaToDraw[i].push(new Array)
                let posY = y
                if(window.player.position.y + window.player.size.y / 2 >= window.displayHeight / 2 && window.player.position.y + window.player.size.y / 2 < window.mapBoundY - window.displayHeight / 2){
                    window.mapOffsetY = (window.player.position.y + window.player.size.y / 2 - window.displayHeight / 2) % window.spriteSize
                    posY += Math.floor((window.player.position.y + window.player.size.y / 2 - window.displayHeight / 2) / window.spriteSize)
                }
                else if(window.player.position.y + window.player.size.y / 2 >= window.mapBoundY - window.displayHeight / 2){
                    posY += this.#customMap[i].length  - Math.round(window.displayHeight / window.spriteSize)
                }
                if(posY < 0) posY = 0
                if(posY >= this.#customMap[i].length - 1) posY = this.#customMap[i].length - 1
                for (let x = 0; x < window.maxSpritesX; x++) {
                    let posX = x
                    if(window.player.position.x + window.player.size.x / 2 >= window.displayWidth / 2 && window.player.position.x + window.player.size.x / 2 < window.mapBoundX - window.displayWidth / 2){
                        window.mapOffsetX = (window.player.position.x + window.player.size.x / 2 - window.displayWidth / 2) % window.spriteSize
                        posX += Math.floor((window.player.position.x + window.player.size.x / 2 - window.displayWidth / 2) / window.spriteSize)
                    }
                    else if(window.player.position.x + window.player.size.x / 2 >= window.mapBoundX - window.displayWidth / 2){
                        posX += this.#customMap[i][posY].length - Math.round(window.displayWidth / window.spriteSize)
                    }
                    if(posX < 0) posX = 0
                    if(posX >= this.#customMap[i][posY].length - 1) posX = this.#customMap[i][posY].length - 1
                    this.#mapAreaToDraw[i][y][x] = this.#customMap[i][posY][posX]
                }
            }
        }
        window.mapRenderArea = this.#mapAreaToDraw
    }
}