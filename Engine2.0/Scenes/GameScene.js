import { Map } from "../Core/Map.js";
import { Scene } from "../Core/Scene.js";
import { Vector2 } from "../Core/Vector2.js";
import { Player } from "../GameObjects/Player.js";

export class GameScene extends Scene{
    #map
    #player

    constructor(){
        super()
        this.#init()
    }

    #init = () => {
        this.#map = new Map()
        this.#map.on('load', (player) => {
            console.log(player)
            this.addObject(player)
            //this.addObject(this.#player = new Player(new Vector2(window.spriteSize, window.spriteSize), true))
            this.trigger('load')
        })
    }

    render = (ctx) => {
        this.#map.render(ctx)
        //this.#player.render(ctx)
        super.render(ctx)
    }

    update = () => {
        this.#map.update()
        //this.#player.update()
        super.update()
    }
}