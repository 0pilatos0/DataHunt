window.mapX = 0
window.mapY = 0
window.playerOffsetX = 0
window.playerOffsetY = 0

//maybe make use of sprite class instead of creating it over and over inside here

export class Map{
    #map
    #tilesets = []
    #tiles = [null]
    #customMap
    #mapAreaToDraw = []
    #bounds = {}

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
        let tMap = []
        this.#bounds.left = 0
        this.#bounds.top = 0
        for (let i = 0; i < this.#map.layers.length; i++) {
            if(this.#map.layers[i].type !== 'tilelayer') return
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
            }
        }
        this.#bounds.bottom = tMap[0].tiles.length * window.spriteSize
        this.#bounds.right = tMap[0].tiles[0].length * window.spriteSize
        console.log(tMap)
        console.log(this.#bounds)
        this.#customMap = tMap
    }

    get map(){
        return this.#customMap
    }
    
    render(ctx){
        ctx.beginPath()
        for (let i = 0; i < this.#mapAreaToDraw.length; i++) {
            for (let y = 0; y < this.#mapAreaToDraw[i].length; y++) {
                for (let x = 0; x < this.#mapAreaToDraw[i][y].length; x++) {
                    ctx.drawImage(this.#mapAreaToDraw[i][y][x], x * window.spriteSize - window.deviceDisplayWidth / 2, y * window.spriteSize - window.deviceDisplayHeight / 2, window.spriteSize, window.spriteSize)
                    ctx.rect(x * window.spriteSize - window.deviceDisplayWidth / 2, y * window.spriteSize -  window.deviceDisplayHeight / 2,  window.spriteSize, window.spriteSize)
                    
                }
            }
        }
        ctx.stroke()
        ctx.fillText(`x: ${window.player.position.x}`, -window.innerWidth / 2, 0)
        ctx.fillText(`y: ${window.player.position.y}`, -window.innerWidth / 2, 30)
        //ctx.fillText(`width: ${window.deviceDisplayWidth/2 - window.spriteSize / 2}`, -window.innerWidth / 2, 60)
        //ctx.fillText(`height: ${window.deviceDisplayHeight/2 - window.spriteSize / 2}`, -window.innerWidth / 2, 90)
        // let tilesX = Math.ceil((window.player.position.x - window.player.position.x % window.spriteSize - window.deviceDisplayWidth / 2) / window.spriteSize)
        // if(tilesX % 2 == 0) tilesX++
        // let tilesY = Math.ceil((window.player.position.y - window.player.position.y % window.spriteSize - window.deviceDisplayHeight / 2) / window.spriteSize)
        // if(tilesY % 2 == 0) tilesY++
        ctx.fillText(window.tilesX, -window.innerWidth / 2, 180)
        ctx.fillText(window.tilesY, -window.innerWidth / 2, 210)
        ctx.fillText(`${window.playerOffsetX}`, -window.innerWidth / 2, 240)
        ctx.fillText(`${window.playerOffsetY}`, -window.innerWidth / 2, 270)
        ctx.fillText(`${window.maxTilesX}`, -window.innerWidth / 2, 300)
        ctx.fillText(`${window.maxTilesY}`, -window.innerWidth / 2, 330)
        ctx.fillText(`${(window.deviceDisplayWidth / 2 - (window.deviceDisplayWidth / 2 % window.spriteSize)) / window.spriteSize}`, -window.innerWidth / 2, 360)
        ctx.fillText(`${(window.deviceDisplayHeight / 2 - (window.deviceDisplayHeight / 2 % window.spriteSize)) / window.spriteSize}`, -window.innerWidth / 2, 390)
    }

    update(){
        if(!this.#customMap) return
        for (let i = 0; i < this.#customMap.length; i++) {
            let tilesX = (window.player.position.x - window.player.position.x % window.spriteSize - window.deviceDisplayWidth / 2) / window.spriteSize
            let tilesY = (window.player.position.y - window.player.position.y % window.spriteSize - window.deviceDisplayWidth / 2) / window.spriteSize
            window.tilesX = tilesX
            window.tilesY = tilesY
            if(!this.#mapAreaToDraw[i]) this.#mapAreaToDraw.push(new Array)
            for (let y = 0; y < window.maxTilesY; y++) {
                if(!this.#mapAreaToDraw[i][y]) this.#mapAreaToDraw[i].push(new Array)
                let posY = y
                if(window.player.position.y >= window.deviceDisplayHeight / 2 - window.spriteSize / 2 && window.player.position.y <= this.#bounds.bottom - window.deviceDisplayHeight / 2) {
                    posY += tilesY
                    //fix bug gotta remove SOMEWHERE half of spritesize both on x and y probably window.deviceDisplayHeight
                }
                // if(window.player.position.y >= this.#bounds.bottom - window.deviceDisplayHeight / 2){
                //     if(y == 0) window.mapY = y
                // }
                if(y == 0) window.mapY = posY // <- not precise enough
                for (let x = 0; x < window.maxTilesX; x++) {
                    let posX = x
                    if(window.player.position.x >= window.deviceDisplayWidth / 2 - window.spriteSize / 2 && window.player.position.x <= this.#bounds.right - window.deviceDisplayWidth / 2){
                        posX += tilesX
                        //fix bug gotta remove SOMEWHERE half of spritesize both on x and y probably window.deviceDisplayWidth
                    }
                    if(x == 0) window.mapX = posX // <-- not precise enough
                    // if(window.player.position.x >= this.#bounds.right - window.deviceDisplayWidth / 2){
                    //     if(x == 0) window.mapX = x
                    // }
                    
                    this.#mapAreaToDraw[i][y][x] = this.#customMap[i].tiles[posY][posX] || new Image()
                }
            }
        }
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