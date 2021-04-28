import Event from "./Event.js";

export default class Input extends Event{
    private _keys: Array<string> = []

    constructor(){
        super()
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if(this._keys.indexOf(e.key) == -1) this._keys.push(e.key)
            this.trigger('press', e.key)
        })
        
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this._keys.splice(this._keys.indexOf(e.key), 1)
            this.trigger('release', e.key)
        })
    }

    public set keys(keys: Array<string>){
        this._keys = keys
    }

    public pressed(key: string){
        if(this._keys.indexOf(key.toLowerCase()) > -1) return true
        else if(this._keys.indexOf(key.toUpperCase()) > -1) return true
        return false
    }
}