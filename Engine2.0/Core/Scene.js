export class Scene{
    #htmlObjects = []
    #gameObjects = []

    constructor(){

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
}