import Event from "./Event.js"

export class Socket extends Event{
    public static socket: any
    private socket: any

    constructor(){
        super()
        this.socket = (window as any).socket
        this.socket.on('connect', () => {
            console.log("Connected to server")
            this.trigger('connected')
        })
        this.socket.on('disconnect', () => {
            console.log("Disconnected from server")
            this.trigger('connected')
        })
        Socket.socket = this
    }

    get connected(){
        return this.socket.connected
    }

    get disconnected(){
        return this.socket.disconnected
    }
}

