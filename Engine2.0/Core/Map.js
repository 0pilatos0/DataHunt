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
    constructor(){
        super()
        this.#init()
    }

    #init = () => {
        let path = '/Engine2.0/Maps/Map/echtemap.json'
        let mapData = new FileLoader(path)
        mapData.on('load', (data) => {
            this.#map = eval(`(${data})`)
            let amount = 0
            for (let i = 0; i < this.#map.tilesets.length; i++) {
                let tilesetLoader = new FileLoader(`/Engine2.0/Maps/Map/${this.#map.tilesets[i].source}`)
                tilesetLoader.on('load', (tilesetData) => {
                    this.#map.tilesets[i] = JSON.parse(tilesetData)
                    this.#map.tilesets[i].image = `/Engine2.0/Maps/Map/${this.#map.tilesets[i].image}`
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
            let img = await CustomImage(this.#map.tilesets[i].image)
            if(img){
                successCount++
                this.#tilesets.push(img)
                successCount + errorCount == this.#map.tilesets.length ? this.#seperateTilesOfTilemaps() : false
            } 
            else{
                errorCount++
                console.log(`Failed loading ${this.#map.tilesets[i].image}`)
            }
        }
    }

    #seperateTilesOfTilemaps = async () => {
        let amount = 0
        let spriteIndex = 0
        for (let i = 0; i < this.#tilesets.length; i++) {
            let tileColumns = this.#tilesets[i].width / this.#map.tilewidth
            let tileRows = this.#tilesets[i].height / this.#map.tileheight
            for (let y = 0; y < tileRows; y++) {
                for (let x = 0; x < tileColumns; x++) {
                    let tileCanvas = document.createElement('canvas')
                    let tileContext = tileCanvas.getContext('2d')

                    tileCanvas.width = this.#map.tilewidth
                    tileCanvas.height = this.#map.tileheight

                    let tX = x * this.#map.tilewidth
                    let tY = y * this.#map.tileheight
                    
                    tileContext.drawImage(this.#tilesets[i], -tX, -tY)
                    let data = null
                    for (let j = 0; j < this.#map.tilesets[i].tiles.length; j++) {
                        if(spriteIndex == this.#map.tilesets[i].tiles[j].id){
                            data = this.#map.tilesets[i].tiles[j]
                        }
                    }
                    spriteIndex++
                    let sprite = new Sprite(tileCanvas.toDataURL('image/png'), data)
                    sprite.on('load', () => {
                        this.#tiles.push(sprite)
                        amount++
                        if(amount == this.#tilesets.length * tileRows * tileColumns)this.#generateMap()
                    })
                }
            }
        }
    }

    #generateMap = async () => {
        this.#customMap = []
        for (let i = 0; i < this.#map.layers.length; i++) {
            if(this.#map.layers[i].type !== 'tilelayer') return
            this.#customMap.push(new Array)
            for (let j = 0; j < this.#map.layers[i].data.length; j++) {
                let row = this.#map.layers[i].data.splice(0, this.#map.width)
                for (let x = 0; x < row.length; x++) {
                    if(row[x] != null) row[x] = new GameObject(new Vector2(x * window.spriteSize, j * window.spriteSize), new Vector2(window.spriteSize, window.spriteSize), this.#tiles[row[x]]?.sprite, this.#tiles[row[x]]?.type)
                }
                this.#customMap[i].push(row)
            }
        }
        window.mapBoundX = this.#map.width * window.spriteSize
        window.mapBoundY = this.#map.height * window.spriteSize
        console.log(this.#customMap)
        window.map = this.#customMap
        this.trigger('load')
    }

    render(ctx){
        for (let i = 0; i < this.#mapAreaToDraw.length; i++) {
            for (let y = 0; y < this.#mapAreaToDraw[i].length; y++) {
                for (let x = 0; x < this.#mapAreaToDraw[i][y].length; x++) {
                    if(this.#mapAreaToDraw[i][y][x]?.visible && this.#mapAreaToDraw[i][y][x]?.sprite) ctx.drawImage(this.#mapAreaToDraw[i][y][x]?.sprite, x * window.spriteSize - window.mapOffsetX - window.displayWidth / 2, y * window.spriteSize - window.mapOffsetY - window.displayHeight / 2)
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