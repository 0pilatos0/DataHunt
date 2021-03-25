import { GameObject } from "../Core/GameObject.js"
import { Animation, Sprite, tilesetToSprites } from "../Core/Sprite.js"
import { Vector2 } from "../Core/Vector2.js"

export class Player extends GameObject{
    #controllable
    #keysPressed = []
    #speed
    #oldPosition
    #animations = []
    constructor(position, size, sprite, controllable = false){
        super(position, size, sprite)
        console.log(sprite)
        this.#controllable = controllable
        this.#init()
    }

    #init = async () => {
        if(this.#controllable){
            this.#speed = 500
            window.player = this
            document.body.addEventListener('keydown', this.#keydown)
            document.body.addEventListener('keyup', this.#keyup)
            tilesetToSprites("/Engine2.0/Sprites/Players/Player1.png").then(sprites => {
                for (let i = 0; i < sprites.length; i++) {
                    new Animation(sprites[i], 200).on('load', (animation) => {
                        console.log(animation)
                        sprites[i] = animation
                        this.#animations[i] = animation
                        sprites[i].on('change', (animation) => {
                            this.#animations[i] = animation
                        })
                    })
                }
                this.trigger('load')
            })
            
        }
    }

    update(){
        super.update()
        this.#oldPosition = new Vector2(this.position.x, this.position.y)
        let steps = 15 //TODO optimize collision checking

        for (let i = 0; i < this.#keysPressed.length; i++) {
            let key = this.#keysPressed[i]
            switch (key) {
                case 'w':
                case 'W':
                    for (let i = 0; i < steps; i++) {
                        this.position.y -= this.#speed * window.deltaTime / steps
                        this.#checkCollisions(() => {this.position.y = Math.round(this.#oldPosition.y)})
                    }
                    break;
                case 'a':
                case 'A':
                    for (let i = 0; i < steps; i++) {
                        this.position.x -= this.#speed * window.deltaTime / steps
                        this.#checkCollisions(() => {this.position.x = Math.round(this.#oldPosition.x)})
                    }
                    break;
                case 's':
                case 'S':
                    for (let i = 0; i < steps; i++) {
                        this.position.y += this.#speed * window.deltaTime / steps
                        this.#checkCollisions(() => {this.position.y = Math.round(this.#oldPosition.y)})
                    }
                    break;
                case 'd':
                case 'D':
                    for (let i = 0; i < steps; i++) {
                        this.position.x += this.#speed * window.deltaTime / steps
                        this.#checkCollisions(() => {this.position.x = Math.round(this.#oldPosition.x)})
                    }
                    break;
                default:
                    break;
            }
        }

        if(this.#keysPressed.includes('w') && !this.#keysPressed.includes('d') && !this.#keysPressed.includes('a')) this.sprite = this.#animations[4].currentSprite
        else if(this.#keysPressed.includes('a') && this.#keysPressed.includes('w')) this.sprite = this.#animations[5].currentSprite
        else if(this.#keysPressed.includes('a') && !this.#keysPressed.includes('w') && !this.#keysPressed.includes('s')) this.sprite = this.#animations[6].currentSprite
        else if(this.#keysPressed.includes('a') && this.#keysPressed.includes('s')) this.sprite = this.#animations[7].currentSprite
        else if(this.#keysPressed.includes('s') && !this.#keysPressed.includes('a') && !this.#keysPressed.includes('d')) this.sprite = this.#animations[8].currentSprite
        else if(this.#keysPressed.includes('d') && !this.#keysPressed.includes('w') && !this.#keysPressed.includes('s')) this.sprite = this.#animations[2].currentSprite
        else if(this.#keysPressed.includes('d') && this.#keysPressed.includes('s')) this.sprite = this.#animations[1].currentSprite
        else if(this.#keysPressed.includes('d') && this.#keysPressed.includes('w')) this.sprite = this.#animations[3].currentSprite
        else this.sprite = this.#animations[0].currentSprite

        if(this.position.x < 0){
            this.position.x = 0
        }
        if(this.position.y < 0){
            this.position.y = 0
        }
        if(this.position.x + this.size.x > window.mapBoundX){
            this.position.x = window.mapBoundX - this.size.x
        }
        if(this.position.y + this.size.y > window.mapBoundY){
            this.position.y = window.mapBoundY - this.size.y
        }
        
    }

    render = (ctx) => {
        if(!this.sprite) return
        if(!this.visible) return
        let renderX = null
        let renderY = null
        if(this.position.x + this.size.x / 2 >= window.displayWidth / 2 && this.position.x + this.size.x / 2 < window.mapBoundX - window.displayWidth / 2){
            renderX = -this.size.x / 2
        }
        if(this.position.y + this.size.y / 2 >= window.displayHeight / 2 && this.position.y + this.size.y / 2 < window.mapBoundY - window.displayHeight / 2){
            renderY = -this.size.y / 2
        }
        if(this.position.x + this.size.x / 2 >= window.mapBoundX - window.displayWidth / 2){
            renderX = this.position.x - window.mapBoundX + window.displayWidth / 2
        }
        if(this.position.y + this.size.y / 2 >= window.mapBoundY - window.displayHeight / 2){
            renderY = this.position.y - window.mapBoundY + window.displayHeight / 2
        }
        window.renderX = renderX
        window.renderY = renderY
        ctx.drawImage(this.sprite.sprite || new Image(), renderX ?? this.position.x - window.displayWidth / 2, renderY ?? this.position.y - window.displayHeight / 2)
    }

    #keydown = (e) => {
        if(this.#keysPressed.indexOf(e.key) == -1) this.#keysPressed.push(e.key)
    }

    #keyup = (e) => {
        this.#keysPressed.splice(this.#keysPressed.indexOf(e.key), 1)
    }

    #checkCollisions = (setPosition) => {
        for (let i = 0; i < window.mapRenderArea?.length; i++) {
            for (let y = 0; y < window.mapRenderArea[i].length; y++) {
                for (let x = 0; x < window.mapRenderArea[i][y].length; x++) {
                    let gameObject = window.mapRenderArea[i][y][x]
                    if(gameObject && gameObject?.visible){
                        if(gameObject.type == 'Collidable' || gameObject.type == 'Interactable'){
                            if(gameObject.position.x >= window.player.position.x - window.displayWidth / 2 && gameObject.position.x < window.player.position.x + window.displayWidth / 2){
                                if(gameObject.position.y >= window.player.position.y - window.displayHeight / 2 && gameObject.position.y < window.player.position.y + window.displayHeight / 2){
                                    if(gameObject != this){
                                        if(this.colliding(gameObject)){
                                            if(gameObject.type == 'Collidable'){
                                                setPosition()
                                            }
                                            if(gameObject.type == 'Interactable'){
                                                gameObject.visible = false
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    get json(){
        let data = super.json
        data.controllable = this.#controllable
        return data
    }
}