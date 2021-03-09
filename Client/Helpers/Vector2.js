export class Vector2{
    #x
    #y

    constructor(x, y){
        
        this.#x = x
        this.#y = y
    }

    set x(x){
        this.#x = x
    }

    get x(){
        return this.#x
    }

    set y(y){
        this.#y = y
    }

    get y(){
        return this.#y
    }
}