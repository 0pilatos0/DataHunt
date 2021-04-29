export default class Event {
    constructor() {
        this._events = {};
        this.on = (event, callback) => {
            if (!this._events[event])
                this._events[event] = [];
            this._events[event].push(callback);
        };
        this.trigger = (event, data, keepTrying = false) => {
            if (!this._events[event] && keepTrying) {
                setTimeout(() => {
                    this.trigger(event, data, keepTrying);
                }, 10);
            }
            else {
                if (!this._events[event])
                    return;
                this._events[event].map((e) => e(data));
            }
        };
    }
}
