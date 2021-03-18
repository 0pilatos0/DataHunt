export class Socket{
    #socket

    constructor(url){
        this.#socket = io(url, {'reconnection': true, 'reconnectionDelay': 1000, 'reconnectionDelayMax': 2000})
        this.#init()
    }

    #init = () => {
        console.log(this.#socket)
        this.#socket.on('connect', () => {
            console.log("Connected to server")
        })
        window.socket = this
    }

    get connected(){
        return this.#socket.connected
    }

    get disconnected(){
        return this.#socket.disconnected
    }
}