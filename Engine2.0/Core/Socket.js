import { HTMLLoader } from "../Loaders/HTMLLoader.js"
import { Window } from "./Window.js"

export class Socket{
    #socket

    constructor(url){
        this.#socket = io(url, {'reconnection': true, 'reconnectionDelay': 1000, 'reconnectionDelayMax': 2000})
        this.#init()
    }

    #init = () => {
        new HTMLLoader("/Engine2.0/editor.html", document.body)
        new Window()
        this.#socket.on('connect', () => {
            console.log("Connected to server")
            gameLoader.style.display = "none"
        })
        this.#socket.on('disconnect', () => {
            console.log("Disconnected from server")
            gameLoader.style.display = "block"
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