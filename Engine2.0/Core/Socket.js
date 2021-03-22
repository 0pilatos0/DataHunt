export class Socket{
    #socket

    constructor(url){
        this.#socket = io(url, {'reconnection': true, 'reconnectionDelay': 1000, 'reconnectionDelayMax': 2000})
        this.#init()
    }

    #init = () => {
        this.#socket.on('connect', () => {
            console.log("Connected to server")
            gameLoader.style.display = "none"
            
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