export class Vector2{
    #x
    #y
    #callback

    constructor(x, y, callback = null){
        this.#x = x
        this.#y = y
        this.#callback = callback
    }

    get x(){
        return this.#x
    }

    set x(x){
        this.#x = x
        if(this.#callback) this.#callback()
    }

    get y(){
        return this.#y
    }

    set y(y){
        this.#y = y
        if(this.#callback) this.#callback()
    }

    toString(){
        return `${this.#x} ${this.#y}`
    }
}