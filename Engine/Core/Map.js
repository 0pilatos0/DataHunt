import { Vector2 } from "./Vector2.js"

export class Map{
    #map
    #tilesets = []
    #tiles = [null]
    #customMap
    #canvasses = []
    #mapAreaToDraw = []

    constructor(path){
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if(xhr.readyState != 4 || xhr.status != 200) return
            this.#map = eval(`(${xhr.responseText})`)
            this.#loadTilesetImages()
        }
        xhr.open('GET', path, true)
        xhr.send()
    }

    #loadTilesetImages = async () => {
        let successCount = 0
        let errorCount = 0
        for (let i = 0; i < this.#map.tilesets.length; i++) {
            let image = new Image()
            image.src = this.#map.tilesets[i].image
            let result = await loadImage(image)
            if(result){
                successCount++
                this.#tilesets.push(image)
                successCount + errorCount == this.#map.tilesets.length ? this.#seperateTiles() : false
            }
            else{
                errorCount++
                console.log(`Failed loading ${this.#map.tilesets[i].image}`)
            }
        }
    }

    #seperateTiles = async() => {
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

                    let tile = new Image()
                    tile.src = tileCanvas.toDataURL('image/png')
                    await loadImage(tile)
                    this.#tiles.push(tile)
                }
            }
        }
        this.#createMap()
    }

    #createMap = () => {
        //let x = 0
        //let y = 0
        let tMap = []
        for (let i = 0; i < this.#canvasses.length; i++) {
            document.body.removeChild(this.#canvasses[i].canvas)
        }
        //this.#canvasses = []
        for (let i = 0; i < this.#map.layers.length; i++) {
            if(this.#map.layers[i].type !== 'tilelayer') return
            //console.log(this.#map)
            // let canvas = document.createElement('canvas')
            // this.#canvasses.push({canvas:canvas,ctx:canvas.getContext('2d')})
            // canvas.style.position = "absolute"
            // document.body.appendChild(canvas)
            //x = 0
            //y = 0
            tMap.push({layer:this.#map.layers[i].type, tiles:new Array})
            for (let j = 0; j < this.#map.layers[i].data.length; j++) {
                let row = this.#map.layers[i].data.splice(0, this.#map.width)
                for (let x = 0; x < row.length; x++) {
                    let tile = this.#tiles[row[x]]
                    if(tile){
                        let tileCanvas = document.createElement('canvas')
                        tileCanvas.width = window.spriteSize
                        tileCanvas.height = window.spriteSize
                        let ctx = tileCanvas.getContext('2d')
                        ctx.drawImage(tile, 0, 0, window.spriteSize, window.spriteSize)
                        row[x] = tileCanvas
                    }
                }
                tMap[i].tiles.push(row)
                // for (let x = 0; x < this.#map.width; x++) {
                //     for (let y = 0; y < this.#map.height; y++) {
                //         if(this.#map.layers[i].data[j]){

                //         }
                //     }
                // }
                // if(j % this.#map.width == 0 && j != 0) {
                //     y += this.#map.tileheight
                //     x = 0
                // }

                // if(this.#map.layers[i].data[j]){
                //     let tile = this.#tiles[this.#map.layers[i].data[j]-1]
                //     let tileCanvas = document.createElement('canvas')
                //     tileCanvas.width = window.spriteSize
                //     tileCanvas.height = window.spriteSize
                //     let ctx = tileCanvas.getContext('2d')
                //     ctx.drawImage(tile, 0, 0, window.spriteSize, window.spriteSize)
                //     tMap[i].tiles.push({tile:tileCanvas, pos:new Vector2(x, y)})
                // }

                // x += this.#map.tilewidth
            }
        }
        
        this.#customMap = tMap
        this.resize()
        //this.initRender()
    }

    render(ctx){
        if(this.#mapAreaToDraw.length > 0)
     
        for (let i = 0; i < this.#mapAreaToDraw.length; i++) {
            for (let y = 0; y < this.#mapAreaToDraw[i].length; y++) {
                for (let x = 0; x < this.#mapAreaToDraw[i][y].length; x++) {
                    ctx.drawImage(this.#mapAreaToDraw[i][y][x], x * window.spriteSize - Math.round(window.deviceDisplayWidth / 2), y * window.spriteSize - Math.round(window.deviceDisplayHeight / 2), window.spriteSize, window.spriteSize)
                }
            }
        }
    }

    update(playerPos){
        if(!this.#customMap) return
        let tilesX = Math.ceil(window.deviceDisplayWidth / window.spriteSize)
        let tilesY = Math.ceil(window.deviceDisplayHeight / window.spriteSize)
        for (let i = 0; i < this.#customMap.length; i++) {
            if(!this.#mapAreaToDraw[i]) this.#mapAreaToDraw.push(new Array)
            for (let y = 0; y < tilesY; y++) {
                let posY = y + Math.trunc(playerPos.y)
                if(posY >= this.#customMap[i].tiles.length) return
                window.offsetY = playerPos.y - Math.trunc(playerPos.y)
                if(y == 0) window.mapY = posY
                if(!this.#mapAreaToDraw[i][y]) this.#mapAreaToDraw[i].push(new Array)
                for (let x = 0; x < tilesX; x++) {
                    let posX = x + Math.trunc(playerPos.x)
                    if(posX >= this.#customMap[i].tiles[posY].length) return
                    window.offsetX = playerPos.x - Math.trunc(playerPos.x)
                    if(x == 0) window.mapX = posX
                    this.#mapAreaToDraw[i][y][x] = this.#customMap[i].tiles[posY][posX] || new Image()
                }
            }
        }
    }

    resize(){
        
    }
}

function loadImage(img){
    return new Promise((resolve, reject) => {
        img.onload = () => {
            return resolve(true)
        }
        img.onerror = () => {
            return resolve(false)
        }
    })
}