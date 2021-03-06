import GameObject from "./GameObject.js";
import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";

export class Player extends GameObject{
    #sprite
    #keysPressed = []

    constructor(position, path){
        super(position, new Vector2(window.spriteSize))
        this.#sprite = new Sprite(path)
        document.addEventListener('keydown', this.#keydown)
        document.addEventListener('keyup', this.#keyup)
    }

    get sprite(){
        return this.#sprite.get()
    }

    render(ctx){
        ctx.drawImage(this.sprite, (this.position.x - window.mapX * spriteSize) - window.playerOffsetX - window.deviceDisplayWidth / 2, (this.position.y - window.mapY * window.spriteSize) - window.playerOffsetY - window.deviceDisplayHeight / 2)
    }

    update(){
        for (let i = 0; i < this.#keysPressed.length; i++) {
            switch (this.#keysPressed[i]) {
                case 'w':
                    this.position.y -= 10
                    break;
                case 'a':
                    this.position.x -= 10
                    break;
                case 's':
                    this.position.y += 10
                    break; 
                case 'd':
                    this.position.x += 10
                    break;
                default:
                    break;
            }
        }
    }
    
    #keydown = (e) => {
        if(this.#keysPressed.indexOf(e.key) == -1)
             this.#keysPressed.push(e.key)
    }

    #keyup = (e) => {
        this.#keysPressed.splice(this.#keysPressed.indexOf(e.key), 1)
    }
}