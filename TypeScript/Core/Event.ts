export default class Event{
    private events: any = {}

    constructor(){

    }

    public on = (event: string, callback: any) => {
        if(!this.events[event]) this.events[event] = new Array
        this.events[event].push(callback)
    }

    public trigger = (event: string, data?: any, keepTrying: boolean = false, amount: number = 0) => {
        if(amount >= 4) return
        if(!this.events[event] && amount < 5 && keepTrying) setTimeout(() => {
            amount++
            this.trigger(event, data, keepTrying, amount)
        }, 10 * amount);
        else{
            if(!this.events[event]) return
            for (let i = 0; i < this.events[event].length; i++) {
                this.events[event][i](data)
            }
        }
    }
}