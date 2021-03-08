import GameObject from "./GameObject.js";
import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";

export class Player extends GameObject{
    //#sprite
    #keysPressed = []

    constructor(position, path){
        super(position, new Vector2(window.spriteSize), path)
        //this.#sprite = new Sprite(path)
        document.addEventListener('keydown', this.#keydown)
        document.addEventListener('keyup', this.#keyup)
    }

    get sprite(){
        //return this.#sprite.get()
    }

    render(ctx){
        ctx.drawImage(this.sprite, (this.position.x - window.mapX * window.spriteSize) - window.playerOffsetX - window.deviceDisplayWidth / 2, (this.position.y - window.mapY * window.spriteSize) - window.playerOffsetY - window.deviceDisplayHeight / 2)
        ctx.fillText(`calculated x ${(this.position.x - window.mapX * window.spriteSize)}`, -window.innerWidth / 2, 120)// - window.playerOffsetX - window.deviceDisplayWidth / 2}`, -window.innerWidth / 2, 120)
        ctx.fillText(`calculated y ${(this.position.y - window.mapY * window.spriteSize)}`, -window.innerWidth / 2, 150)// - window.playerOffsetY - window.deviceDisplayHeight / 2}`, -window.innerWidth / 2, 150)
    }

    update(){
        for (let i = 0; i < this.#keysPressed.length; i++) {
            switch (this.#keysPressed[i]) {
                case 'w':
                    this.position.y -= 1
                    break;
                case 'a':
                    this.position.x -= 1
                    break;
                case 's':
                    this.position.y += 1
                    break; 
                case 'd':
                    this.position.x += 1
                    break;
                default:
                    break;
            }
        }
        window.playerOffsetX = 0
        window.playerOffsetY = 0
        if(this.position.x >= window.deviceDisplayWidth / 2 - window.spriteSize / 2){// && window.player.position.x <= this.#bounds.right - window.deviceDisplayWidth / 2){
            //posX += Math.floor((window.player.position.x - window.player.position.x % window.spriteSize - (window.deviceDisplayWidth) / 2) / window.spriteSize)
            window.playerOffsetX = (this.position.x) % window.spriteSize//window.mapX + 1 * window.spriteSize//-//- (window.deviceDisplayWidth / 2)) % window.spriteSize
            //fix bug gotta remove SOMEWHERE half of spritesize both on x and y probably window.deviceDisplayWidth
        }
        if(this.position.y >= window.deviceDisplayHeight / 2 - window.spriteSize / 2){// && window.player.position.y <= this.#bounds.bottom - window.deviceDisplayHeight / 2) {
            //posY += Math.floor((window.player.position.y - window.player.position.y % window.spriteSize - (window.deviceDisplayHeight) / 2) / window.spriteSize)
            window.playerOffsetY = (this.position.y) % window.spriteSize//window.mapY + 1 * window.spriteSize//-//- (window.deviceDisplayHeight / 2)) % window.spriteSize
            //fix bug gotta remove SOMEWHERE half of spritesize both on x and y probably window.deviceDisplayHeight
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