import { Events } from "./Event.js"

export class Vector2 extends Events{
    #x
    #y

    constructor(x, y){
        super()
        this.#x = x
        this.#y = y
    }

    get x(){
        return this.#x
    }

    set x(x){
        this.#x = x
        this.trigger('x')
    }

    get y(){
        return this.#y
    }

    set y(y){
        this.#y = y
        this.trigger('y')
    }

    toString(){
        return `${this.#x} ${this.#y}`
    }
}