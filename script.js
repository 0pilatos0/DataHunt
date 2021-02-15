let socket = io("https://datahuntserver.herokuapp.com")
import {Vector2} from './Helpers/Vector2.js'

socket.on('connect', () => {
    console.log("connected")
})

let frames = 0, displayFrames = 0
let secondsPassed = 0

let ctx = game.getContext("2d", { alpha:false })
document.onreadystatechange = () => {
    setCanvasSize()
    ctx.imageSmoothingEnabled = false
    ctx.mozSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    window.onresize = (e) => {
        setCanvasSize()
        //ctx.fillRect(0, 0, game.width, game.height)
        // for (let y = 0; y < 300; y++) {
        //     for (let x = 0; x < 300; x++) {
        //         drawRectangleWithColor(new Vector2(x, y), new Vector2(1, 1), getRandomColor())
        //     }
        // }
    }
    window.requestAnimationFrame(gameLoop)
    setInterval(() => {
        secondsPassed++
    }, 1000);
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function setCanvasSize(){
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}

function drawRectangle(position, size){
    if(!(size instanceof Vector2) || !(position instanceof Vector2)) return
    ctx.rect(position.x, position.y, size.x, size.y)
    ctx.stroke()
}

function drawRectangleWithColor(position, size, color){
    if(!(size instanceof Vector2) || !(position instanceof Vector2)) return
    ctx.fillStyle = color
    ctx.fillRect(position.x, position.y, size.x, size.y)
}

function drawText(position, text, fontSize){
    if(!(position instanceof Vector2)) return
    ctx.font = `${fontSize}px Minecraft`
    ctx.fillStyle = "#FF0000"
    ctx.fillText(text, position.x, position.y)
}

function gameLoop(){
    ctx.clearRect(0, 0, game.width, game.height)
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, game.width, game.height)
    frames++
    drawText(new Vector2(game.width - ctx.measureText(displayFrames).width, ctx.measureText(displayFrames).actualBoundingBoxAscent), displayFrames, 20)
    if(secondsPassed >= 1){
        displayFrames = frames
        frames = 0
        secondsPassed = 0
    }
    window.requestAnimationFrame(gameLoop)
}