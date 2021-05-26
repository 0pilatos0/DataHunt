module.exports.Event = class{
    #events = {}

    constructor(){

    }

    on = (event, callback) => {
        if(!this.#events[event]) this.#events[event] = []
        this.#events[event].push(callback)
    }

    trigger = (event, data = null, keepTrying = false) => {
        if(!this.#events[event] && keepTrying){
            setTimeout(() => {
                this.trigger(event, data, keepTrying)
            }, 10);
        }
        else{
            if(!this.#events[event]) return
            this.#events[event].map(e => e(data))
        }
    }
}