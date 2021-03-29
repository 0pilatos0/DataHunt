import Event from "./Event.js"
import Sprite from "./Sprite.js"

export const enum AnimationState{
    DEFAULT,
    PLAYING,
    PAUSED
}

export default class Animation extends Event{
    private _frames: Array<any> = []
    private _interval: any
    private _activeSprite: Sprite = new Sprite('')
    private _state: AnimationState = AnimationState.PAUSED

    constructor(){
        super()
        this.init()
    }

    private init(){
        this.on('add', () => {
            let totalDuration: number = 0
            this._frames.map(o => {totalDuration += o.duration})
            clearInterval(this._interval)
            this._interval = setInterval(() => {
                if(this._state == AnimationState.PLAYING){
                    for (let s = 0; s < this._frames.length; s++) {
                        setTimeout(() => {
                            this._activeSprite = this._frames[s].sprite
                            this.trigger('change', this._frames[s].sprite)
                        }, this._frames[s].duration * s)
                    }
                }
            }, totalDuration)
        }) 
    }

    public add(sprite: Sprite, duration: number){
        this._frames.push({sprite, duration})
        this.trigger('add')
    }
    

    get sprites(){
        let data: Array<Sprite> = []
        this._frames.map(f => {data.push(f.sprite)})
        return data
    }

    get activeSprite(){
        return this._activeSprite
    }

    get state(){
        return this._state
    }

    set state(state: AnimationState){
        this._state = state
    }
}