export default class Event{
    private events: any = {}

    constructor(){

    }

    public on = (event: string, callback: any) => {
        if(!this.events[event]) this.events[event] = new Array
        this.events[event].push(callback)
    }

    public trigger = (event: string, data?: any, amount: number = 0) => {
        if(amount >= 5) return
        if(!this.events[event]) setTimeout(() => {
            amount++
            this.trigger(event, data, amount)
        }, 10 * amount);
        else{
            for (let i = 0; i < this.events[event].length; i++) {
                this.events[event][i](data)
            }
        }
    }
}