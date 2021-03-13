import { CustomImage, Sprite } from "./Sprite.js"

export class Map{
    #map
    #tilesets = []
    #tiles = [null]
    #customMap
    #mapAreaToDraw = []
    constructor(){
        this.#init()
    }

    #init = () => {
        let path = '/Engine2.0/Maps/testmap.json'
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if(xhr.readyState != 4 || xhr.status != 200) return
            this.#map = eval(`(${xhr.responseText})`)
            this.#loadTilemaps()
        }
        xhr.open('GET', path, true)
        xhr.send()
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

                    this.#tiles.push(await Sprite(tileCanvas.toDataURL('image/png')))
                    //this.#tiles.push(this.#tilesets[i])
                }
            }
        }
        this.#generateMap()
    }

    #generateMap = async () => {
        this.#customMap = []
        for (let i = 0; i < this.#map.layers.length; i++) {
            if(this.#map.layers[i].type !== 'tilelayer') return
            this.#customMap.push({layer:this.#map.layers[i].type, tiles:new Array})
            for (let j = 0; j < this.#map.layers[i].data.length; j++) {
                let row = this.#map.layers[i].data.splice(0, this.#map.width)
                for (let x = 0; x < row.length; x++) {
                    let tile = this.#tiles[row[x]]
                    if(tile){
                        row[x] = tile
                    }
                }
                this.#customMap[i].tiles.push(row)
            }
        }
        console.log(this.#customMap)
    }

    render(ctx){
        for (let i = 0; i < this.#mapAreaToDraw.length; i++) {
            for (let y = 0; y < this.#mapAreaToDraw[i].length; y++) {
                for (let x = 0; x < this.#mapAreaToDraw[i][y].length; x++) {
                    ctx.drawImage(this.#mapAreaToDraw[i][y][x], x * window.spriteSize - window.displayWidth / 2, y * window.spriteSize - window.displayHeight / 2)
                    //ctx.rect(x * window.spriteSize - window.deviceDisplayWidth / 2, y * window.spriteSize -  window.deviceDisplayHeight / 2,  window.spriteSize, window.spriteSize)
                    
                }
            }
        }
    }

    update(){
        if(!this.#customMap) return
        for (let i = 0; i < this.#customMap.length; i++) {
            if(!this.#mapAreaToDraw[i]) this.#mapAreaToDraw.push(new Array)
            for (let y = 0; y < window.maxSpritesY; y++) {
                if(!this.#mapAreaToDraw[i][y]) this.#mapAreaToDraw[i].push(new Array)
                let posY = y
                for (let x = 0; x < window.maxSpritesX; x++) {
                    let posX = x
                    this.#mapAreaToDraw[i][y][x] = this.#customMap[i].tiles[posY][posX] || new Image()
                }
            }
        }
    }
}