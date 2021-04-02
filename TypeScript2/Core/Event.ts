import { IFunctionDictionary } from "./Interfaces/IDictionary.js"

export default class Event{
    private _events: IFunctionDictionary = {}

    constructor(){

    }

    public on = (event: string, callback: any) => {
        if(!this._events[event]) this._events[event] = new Array
        this._events[event].push(callback)
    }

    public trigger = (event: string, data?: any, keepTrying: boolean = false) => {
        if(!this._events[event] && keepTrying){
            setTimeout(() => {
                this.trigger(event, data, keepTrying)
            }, 10);
        }
        else{
            if(!this._events[event]) return
            this._events[event].map((e: Function) => e(data))
        }
    }
}