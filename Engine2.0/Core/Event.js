export class Event{
    #callbacks = []
    constructor(){

    }

    on = (callback) => {
        this.#callbacks.push(callback)
    }

    trigger = () => {
        for (let i = 0; i < this.#callbacks.length; i++) {
            this.#callbacks[i]()
        }
    }
}

export class Events{
    #events = {}
    constructor(){

    }

    on = (event, callback) => {
        if(!this.#events[event]) this.#events[event] = []
        this.#events[event].push(callback)
    }

    trigger = (event) => {
        if(!this.#events[event]) return
        for (let i = 0; i < this.#events[event].length; i++) {
            this.#events[event][i]()
        }
    }
}