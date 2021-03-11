import { GameObject } from "../GameObject.js"
import { Sprite } from "../Sprite.js"

export class Player extends GameObject{
    #keysPressed = []
    constructor(position, size, controllable = false){
        super(position, size, new Sprite(''))
        this.#init(controllable)
    }

    #init = (controllable) => {
        if(controllable){
            document.body.addEventListener('keydown', this.#keydown)
            document.body.addEventListener('keyup', this.#keyup)
        }
    }

    update(){
        super.update()
        for (let i = 0; i < this.#keysPressed.length; i++) {
            let key = this.#keysPressed[i]
            switch (key) {
                case 'w':
                case 'W':
                    break;
                case 'a':
                case 'A':
                    break;
                case 's':
                case 'S':
                    break;
                case 'd':
                case 'D':
                    break;
                default:
                    break;
            }
        }
    }

    #keydown = (e) => {
        if(this.#keysPressed.indexOf(e.key) == -1) this.#keysPressed.push(e.key)
    }

    #keyup = (e) => {
        this.#keysPressed.splice(this.#keysPressed.indexOf(e.key), 1)
    }
}