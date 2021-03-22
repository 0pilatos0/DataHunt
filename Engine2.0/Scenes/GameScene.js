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
        this.#player = new Player(new Vector2(window.spriteSize, window.spriteSize), true)
        this.addObject(this.#player)
    }

    render = (ctx) => {
        this.#map.render(ctx)
        this.#player.render(ctx)
        super.render(ctx)
    }

    update = () => {
        this.#map.update()
        this.#player.update()
        super.update()
    }
}