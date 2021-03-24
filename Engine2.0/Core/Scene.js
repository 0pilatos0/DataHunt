import { Events } from "./Event.js"

export class Scene extends Events{
    #htmlObjects = []
    #gameObjects = []

    constructor(){
        super()
    }

    render(ctx){
        for (let i = 0; i < this.#htmlObjects.length; i++) {
            this.#htmlObjects[i].render()
         }
         for (let i = 0; i < this.#gameObjects.length; i++) {
             this.#gameObjects[i].render(ctx)
         }
    }

    update(){
        for (let i = 0; i < this.#htmlObjects.length; i++) {
           this.#htmlObjects[i].update()
        }
        for (let i = 0; i < this.#gameObjects.length; i++) {
            this.#gameObjects[i].update()
        }
    }

    addObject(object){
        if(object.__proto__?.__proto__ == 'GameObject') this.#gameObjects.push(object)
        else if(object.__proto__?.__proto__ == 'HTMLObject') this.#htmlObjects.push(object)
    }
}