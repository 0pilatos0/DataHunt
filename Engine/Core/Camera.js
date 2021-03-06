import { Canvas } from "./Canvas.js";

export class Camera{
    #canvas

    constructor(){
        this.#canvas = new Canvas()
    }

    render(){
        this.#canvas.clear()
        window.gameMap.render(this.#canvas.ctx)
        window.player.render(this.#canvas.ctx)
    }

    update(){
        window.gameMap.update()
        window.player.update()
    }
}