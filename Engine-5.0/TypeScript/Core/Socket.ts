import Event from "./Event.js"

export class Socket extends Event{
    public static socket: any
    private socket: any

    constructor(){
        super()
        Socket.socket = this
        let createSocketInterval = setInterval(() => {
            this.socket = (window as any).socket
            if((window as any).socket) {
                this.trigger('ready')
                clearInterval(createSocketInterval)
            }
        }, 1)
        this.on('ready', () => {
            this.socket.on('connect_error', () => {
                this.trigger('failed')
            })
            this.socket.on('connect', () => {
                console.log("Connected to server")
                this.trigger('connected')
            })
            this.socket.on('disconnect', () => {
                console.log("Disconnected from server")
                this.trigger('disconnected')
            })
       })
    }

    get connected(){
        return this.socket.connected
    }

    get disconnected(){
        return this.socket.disconnected
    }
}

