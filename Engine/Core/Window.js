//import { Rectangle } from "../Shapes/Rectangle.js"
import { Camera } from "./Camera.js"
import { Map } from "./Map.js"
import { Player } from "./Player.js"
import { Vector2 } from "./Vector2.js"

window.windows = []

export class Window{
    #elements = []
    #keysPressed = []

    constructor(){
        window.windows.push(this)
    }

    init(){
        return new Promise((resolve, reject) => {
            window.camera = new Camera()
            window.player = new Player(new Vector2(0, 0), '/Engine/Sprites/player.png')
            window.gameMap = new Map('testmap.json')
            
            //document.addEventListener('keypress', this.#keypress)
            return resolve(true)
        })
    }

    update(){
        window.camera.update()
    }

    render(){
        window.camera.render()
    }

    // #keypress = (e) => {
        
    // }
}

