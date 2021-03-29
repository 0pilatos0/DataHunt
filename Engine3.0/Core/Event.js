export default class Event {
    constructor() {
        this.events = {};
        this.on = (event, callback) => {
            if (!this.events[event])
                this.events[event] = new Array;
            this.events[event].push(callback);
        };
        this.trigger = (event, data, amount = 0) => {
            if (amount >= 4)
                return;
            if (!this.events[event] && amount < 5)
                setTimeout(() => {
                    amount++;
                    this.trigger(event, data, amount);
                }, 10 * amount);
            else {
                for (let i = 0; i < this.events[event].length; i++) {
                    this.events[event][i](data);
                }
            }
        };
    }
}
