let socket = io("https://datahuntserver.herokuapp.com")
window.socket = socket
import {Vector2} from './Helpers/Vector2.js'
import {drawText} from './Helpers/Draw.js'
import {InputField} from './Elements/InputField.js'
import { Button } from './Elements/Button.js'
import { Label } from './Elements/Label.js'
import { Scene } from './Helpers/Scene.js'
import { LoginScene } from './Scenes/loginScene.js'
import { RegisterScene } from './Scenes/registerScene.js'

socket.on('connect', () => {
    console.log("connected")
})

let frames = 0, displayFrames = 0
let secondsPassed = 0

let ctx = game.getContext("2d", { alpha:false })
window.ctx = ctx

let scenes = []
let loginScene = new LoginScene()
let registerScene = new RegisterScene()
loginScene.visible = false
scenes.push(loginScene)
scenes.push(registerScene)

// console.log(window.sessionStorage)
// window.sessionStorage.setItem("username", "Pizza")
// console.log(window.sessionStorage.getItem("username"))

document.onreadystatechange = () => {
    setCanvasSize()
    ctx.imageSmoothingEnabled = false
    ctx.mozSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    window.onresize = e => {
        setCanvasSize()
        // for (let i = 0; i < window.inputFields.length; i++) {
        //     window.inputFields[i].reDraw()
        // }
        // console.log(test.style)
        // test.style.left = window.innerWidth / 2 - (test.style.width || 177) / 2 + "px"
        // test.style.top = window.innerHeight / 2 - (test.style.height || 22) / 2 + "px"
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
    // for (let i = 0; i < window.inputFields.length; i++) {
    //     window.inputFields[i].reDraw()
    // }
    registerScene.render()
    window.requestAnimationFrame(gameLoop)
}