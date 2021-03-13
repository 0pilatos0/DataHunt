import { GameObject } from "../GameObject.js"
import { Sprite } from "../Sprite.js"

export class Player extends GameObject{
    #controllable
    #keysPressed = []
    constructor(position, size, controllable = false){
        super(position, size, Sprite(''))
        this.#controllable = controllable
        this.#init()
    }

    #init = () => {
        if(this.#controllable){
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

    get json(){
        let data = super.json
        data.controllable = this.#controllable
        return data
    }
}