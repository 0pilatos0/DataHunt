import AnimationState from "./Enums/AnimationState.js";
import Event from "./Event.js";

export default class Animation extends Event{
    private _frames: Array<any> = []
    private _interval: any
    private _activeSpriteIndex: any = -1
    private _state: AnimationState = AnimationState.PAUSED
    
    constructor(){
        super()
        this.on('add', () => {
            let totalDuration: number = 0
            this._frames.map(o => {totalDuration += o.duration})
            clearInterval(this._interval)
            if(this._frames.length == 1) this._activeSpriteIndex = this._frames[0].spriteIndex
            this._interval = setInterval(() => {
                if(this._state == AnimationState.PLAYING){
                    for (let s = 0; s < this._frames.length; s++) {
                        setTimeout(() => {
                            this._activeSpriteIndex = this._frames[s].spriteIndex
                        }, this._frames[s].duration * s)
                    }
                }
            }, totalDuration)
        }) 
    }

    public add(spriteIndex: number, duration: number){
        this._frames.push({spriteIndex, duration})
        this.trigger('add')
    }

    get sprites(){
        let data: Array<number> = []
        this._frames.map(f => {data.push(f.spriteIndex)})
        return data
    }

    get activeSpriteIndex(){
        return this._activeSpriteIndex
    }

    get state(){
        return this._state
    }

    set state(state: AnimationState){
        this._state = state
    }
}