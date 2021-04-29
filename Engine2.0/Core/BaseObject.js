import { Events } from "./Event.js"

export class BaseObject extends Events{
    #position
    #size
    #visible = true

    constructor(position, size){
        super()
        this.#position = position
        this.#size = size
        this.#init()
    }

    #init = () => {
        this.#position.on('x', () => {this.position = this.#position})
        this.#position.on('y', () => {this.position = this.#position})
        this.#size.on('x', () => {this.size = this.#size})
        this.#size.on('y', () => {this.size = this.#size})
        this.trigger('load')
    }

    set size(size){
        this.#size = size
    }

    get size(){
        return this.#size
    }

    set position(position){
        this.#position = position
    }

    get position(){
        return this.#position
    }

    set visible(visible){
        this.#visible = visible
    }

    get visible(){
        return this.#visible
    }

    get json(){
        return {
            position: this.position,
            size: this.size,
            visible: this.visible
        }
    }

    render(){

    }

    update(){

    }
}