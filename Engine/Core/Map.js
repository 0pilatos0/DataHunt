import { Vector2 } from "./Vector2.js"

export class Map{
    #map
    #tilesets = []
    #tiles = []
    #tileWidth
    #tileHeight
    #customMap
    #scale = 1
    #canvasses = []

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
        this.#tileWidth = this.#map.tilewidth
        this.#tileHeight = this.#map.tileheight
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
        let x = 0
        let y = 0
        let tMap = []

        for (let i = 0; i < this.#map.layers.length; i++) {
            if(this.#map.layers[i].type !== 'tilelayer') return
            let canvas = document.createElement('canvas')
            this.#canvasses.push({canvas:canvas,ctx:canvas.getContext('2d')})
            canvas.style.position = "absolute"
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            document.body.appendChild(canvas)
            x = 0
            y = 0
            tMap.push({layer:this.#map.layers[i].type, tiles:new Array})
            for (let j = 0; j < this.#map.layers[i].data.length; j++) {
                if(j % this.#map.width == 0 && j != 0) {
                    y += this.#map.tileheight
                    x = 0
                }

                if(this.#map.layers[i].data[j]){
                    let tile = this.#tiles[this.#map.layers[i].data[j]-1]
                    let canvas = document.createElement('canvas')
                    canvas.width = this.#tileWidth
                    canvas.height = this.#tileHeight
                    let ctx = canvas.getContext('2d')
                    ctx.drawImage(tile, 0, 0, this.#tileWidth, this.#tileHeight)
                    tMap[i].tiles.push({tile:canvas, pos:new Vector2(x, y)})
                }

                x += this.#map.tilewidth
            }
        }
        this.#customMap = tMap
    }

    render(){
        if(!this.#customMap) return
        let posX = 0
        let posY = 320
        let amount = 0
        for (let i = 0; i < 1; i++) {//this.#customMap.length
            for (let j = 0; j < this.#customMap[i].tiles.length; j++) {
                //this.#customMap[i].tiles[j].pos.x * this.#scale > Math.floor(posX / this.#tileWidth) * this.#scale
                //this.#customMap[i].tiles[j].pos.y * this.#scale > Math.floor(posY / this.#tileWidth) * this.#scale
                if(this.#customMap[i].tiles[j].pos.x * this.#scale > posX * this.#scale && (this.#customMap[i].tiles[j].pos.x) * this.#scale < window.innerWidth + (posX * this.#scale) && this.#customMap[i].tiles[j].pos.y * this.#scale > posY * this.#scale && this.#customMap[i].tiles[j].pos.y * this.#scale < window.innerHeight + (posY * this.#scale)){
                    this.#canvasses[i].ctx.drawImage(this.#customMap[i].tiles[j].tile, (this.#customMap[i].tiles[j].pos.x - posX) * this.#scale, (this.#customMap[i].tiles[j].pos.y - posY) * this.#scale, this.#tileWidth * this.#scale, this.#tileHeight * this.#scale)
                    this.#canvasses[i].ctx.fillText(amount, (this.#customMap[i].tiles[j].pos.x - posX) * this.#scale, (this.#customMap[i].tiles[j].pos.y - posY) * this.#scale)
                    amount++
                }
            }
        }
        console.log(amount)
    }

    update(){

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