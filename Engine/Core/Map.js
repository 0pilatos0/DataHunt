import { Vector2 } from "./Vector2.js"

export class Map{
    #map
    #tilesets = []
    #tiles = [null]
    #tileWidth
    #tileHeight
    #customMap
    //#scale = 3
    #canvasses = []
    #lowestX = 0
    #highestX = 0
    #lowestY = 0
    #highestY = 0

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
        //let x = 0
        //let y = 0
        let tMap = []
        for (let i = 0; i < this.#canvasses.length; i++) {
            document.body.removeChild(this.#canvasses[i].canvas)
        }
        this.#canvasses = []
        for (let i = 0; i < this.#map.layers.length; i++) {
            if(this.#map.layers[i].type !== 'tilelayer') return
            //console.log(this.#map)
            let canvas = document.createElement('canvas')
            this.#canvasses.push({canvas:canvas,ctx:canvas.getContext('2d')})
            canvas.style.position = "absolute"
            document.body.appendChild(canvas)
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
        console.log(this.#customMap)
        this.resize()
        this.initRender()
    }

    render(playerPos){
        if(!this.#customMap) return
        //let posX = Math.floor(1200 / 2 / this.#tileWidth) * this.#tileWidth
        //let posY = Math.floor(1600 / 2 / this.#tileHeight) * this.#tileHeight

         
        // let amount = 0
        // let pPosX = 32
        // let pPosY = 32
        // for (let i = 0; i < this.#customMap.length; i++) {//this.#customMap.length
        //     this.#canvasses[i].ctx.clearRect(-window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth, window.innerHeight)
        //     for (let j = 0; j < this.#customMap[i].tiles.length; j++) {
        //         let tileX = this.#customMap[i].tiles[j].pos.x
        //         let tileY = this.#customMap[i].tiles[j].pos.y
        //         //console.log(-(window.innerWidth / 2))
        //         //console.log(-(window.innerHeight / 2))
        //         //console.log(`${tileX} ${tileY}`)
        //         if(tileX - pPosX >= 0 && 
        //         tileX < window.innerWidth + pPosX && 
        //         tileY - pPosY >= 0 && 
        //         tileY < window.innerHeight + pPosY){
        //             this.#canvasses[i].ctx.drawImage(this.#customMap[i].tiles[j].tile, (tileX - window.innerWidth / 2) * window.spriteSize, (tileY - window.innerHeight / 2) * window.spriteSize)//, this.#tileWidth, this.#tileHeight)//, this.#tileWidth, this.#tileHeight
        //             //this.#canvasses[i].ctx.fillText(amount, (this.#customMap[i].tiles[j].pos.x - posX) * this.#scale, (this.#customMap[i].tiles[j].pos.y - posY) * this.#scale)
        //             amount++
        //         }
        //     }
        // }
        // console.log(amount)

        let amount = 0

        let tilesX = Math.ceil(window.deviceDisplayWidth / 96 + 3)
        let tilesY = Math.ceil(window.deviceDisplayHeight / 96 + 3)

        for (let i = 0; i < this.#customMap.length; i++) {
            this.#canvasses[i].ctx.clearRect(-(tilesX * 96 / 2), -(tilesY * 96 / 2), tilesX * 96, tilesY * 96)
            //math.ceil amount of viewable x and y pieces and than draw based on player pos which map pieces to draw
            
            for (let y = 0; y < this.#customMap[i].tiles.length; y++) {
                // let mapY = y + Math.floor(playerPos.y / 96)
                // let posY = y * 96 - playerPos.y // + 1// + (playerPos.y - Math.trunc(playerPos.y)) / 96
                for (let x = 0; x < this.#customMap[i].tiles[y].length; x++) {
                    // let mapX = x + Math.floor(playerPos.x / 96)
                    // let posX = x * 96 - playerPos.x // - Math.floor(playerPos.x / 96)// + (playerPos.x - Math.trunc(playerPos.x)) / 96
                    // //console.log(`${mapX} ${mapY}`)
                    
                    // //console.log(this.#customMap[i].tiles[mapY][mapX])
                    
                    // //console.log(`${mapX} ${mapY}`)
                    
                    
                    // // if(mapY < 0) return //mapY = 0
                    // // if(mapX < 0) return //mapX = 0
                    // // if(mapX >= this.#customMap[i].tiles[mapY][mapX].length) return
                    // // if(mapY >= this.#customMap[i].tiles[mapY].length) return
                    
                    // // && mapX < this.#customMap[i].tiles[mapY][mapX].length && mapY < this.#customMap[i].tiles[mapY].length
                    // if(mapY >= 0 && mapX >= 0){
                    //     //console.log(`${mapX} ${mapY}`)
                    //     amount++
                    //     
                    // }
                    //this.#canvasses[i].ctx.drawImage(this.#customMap[i].tiles[y][x] || new Image(), x * 96, y * 96, 96, 96)
                }
            }


            // for (let y = 0; y < this.#customMap[i].tiles.length; y++) {
            //     for (let x = 0; x < this.#customMap[i].tiles[y].length; x++) {
            //         if(this.#customMap[i].tiles[y][x]){
            //             let tX = 96 * x
            //             let tY = 96 * y
            //             let tPosX = Math.floor(playerPos.x / 96) * 96
            //             let tPosY = Math.floor(playerPos.y / 96) * 96 
            //             if(tX - tPosX >= 0 && 
            //                 tX - tPosX < window.innerWidth &&
            //                 tY - tPosY >= 0 &&
            //                 tY - tPosY < window.innerHeight){
            //                     amount++
            //                     if(i == 0){
            //                         //this.#lowestX > x || this.#lowestX == 0 ? this.#lowestX = x : false
            //                         this.#highestX < x ? this.#highestX = x : false
            //                         //this.#lowestY > y || this.#lowestY == 0 ? this.#lowestY = y : false
            //                         this.#highestY < y ? this.#highestY = y : false
            //                     }
            //                     this.#canvasses[i].ctx.drawImage(this.#customMap[i].tiles[y][x], tX - tPosX, tY - tPosY, 96, 96)
            //                 }
            //         }
                        
            //     }
            //     //resize drawed canvas too?
            // }
        }
        //console.log(amount)
        //console.log(this.#highestX - Math.floor(window.innerWidth / 96))
        //console.log(this.#highestX)
        
        //console.log(this.#highestY - Math.floor(window.innerHeight / 96))
        //console.log(this.#highestY)
    }

    initRender(){
        for (let i = 0; i < this.#customMap.length; i++) {
            this.#canvasses[i].canvas.width = this.#customMap[i].tiles[0].length * 96
            this.#canvasses[i].canvas.height = this.#customMap[i].tiles.length * 96
            for (let y = 0; y < this.#customMap[i].tiles.length; y++) {
                for (let x = 0; x < this.#customMap[i].tiles[y].length; x++) {
                    this.#canvasses[i].ctx.drawImage(this.#customMap[i].tiles[y][x] || new Image(), x * 96, y * 96, 96, 96)
                }
            }
        }
    }

    update(){

    }

    resize(){
        for (let i = 0; i < this.#canvasses.length; i++) {
            let canvas = this.#canvasses[i].canvas
            let ctx = this.#canvasses[i].ctx
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            let scaleFitNative = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
            window.deviceDisplayWidth = window.innerWidth / scaleFitNative
            window.deviceDisplayHeight = window.innerHeight / scaleFitNative

            ctx.setTransform(scaleFitNative, 0, 0, scaleFitNative, Math.floor(window.innerWidth/2), Math.floor(window.innerHeight/2))
            ctx.imageSmoothingEnabled = scaleFitNative < 1 ?  true : false
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