import Event from "./Event.js";
export class Socket extends Event {
    constructor() {
        super();
        this._socket = window.socket;
        Socket.socket = this;
        let createSocketInterval = setInterval(() => {
            this._socket = window.socket;
            if (window.socket) {
                this.trigger('ready');
                this._socket.onAny((e, args) => {
                    this.trigger(e, args);
                });
                clearInterval(createSocketInterval);
            }
        }, 1);
        this.on('ready', () => {
            this._socket.on('connect_error', () => {
                this.trigger('failed');
            });
            this._socket.on('connect', () => {
                this.trigger('connected');
            });
            this._socket.on('disconnect', () => {
                this.trigger('disconnected');
            });
        });
    }
    get connected() {
        return this._socket.connected;
    }
    get disconnected() {
        return this._socket.disconnected;
    }
    emit(message, data) {
        this._socket.emit(message, data);
    }
}
