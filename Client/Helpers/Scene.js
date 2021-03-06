
window.scenes = []

export class Scene{
    #elements = []
    #visible = true

    constructor(){
        window.scenes.push(this)
    }

    set visible(visible){
        this.#visible = visible
        for (let i = 0; i < this.#elements.length; i++) {
            this.#elements[i].visible = visible
        }
    }

    get visible(){
        return this.#visible
    }

    addElement(element){
        this.#elements.push(element)
    }

    removeElement(element){
        this.#elements[this.#elements.indexOf(element)] 
    }

    render(){
        if(!this.#visible) return
        for (let i = 0; i < this.#elements.length; i++) {
            this.#elements[i].reDraw()
        }
    }
}