import { Map } from "../Core/Map.js";
import { Scene } from "../Core/Scene.js";
import { Vector2 } from "../Core/Vector2.js";
import { Player } from "../GameObjects/Player.js";

export class GameScene extends Scene{
    #map

    constructor(){
        super()
        this.#init()
    }

    #init = () => {
        this.#map = new Map()
        this.addObject(new Player(new Vector2(0, 0), true))
    }

    render = (ctx) => {
        this.#map.render(ctx)
        super.render(ctx)
    }

    update = () => {
        this.#map.update()
        super.update()
    }
}