import Event from "./Event.js"

export class Socket extends Event{
    public static socket: any
    private _socket: any

    constructor(){
        super()
        Socket.socket = this
        let createSocketInterval = setInterval(() => {
            this._socket = (window as any).socket
            if((window as any).socket) {
                this.trigger('ready')
                clearInterval(createSocketInterval)
            }
        }, 1)
        this.on('ready', () => {
            this._socket.on('connect_error', () => {
                this.trigger('failed')
            })
            this._socket.on('connect', () => {
                this.trigger('connected')
            })
            this._socket.on('disconnect', () => {
                this.trigger('disconnected')
            })
            this._socket.on('login', (data: any) => {
                this.trigger('login', data)
            })
            this._socket.on('register', (data: any) => {
                this.trigger('register', data)
            })
        })
    }

    get connected(){
        return this._socket.connected
    }

    get disconnected(){
        return this._socket.disconnected
    }

    public emit(message: string, data: any){
        this._socket.emit(message, data)
    }
}

