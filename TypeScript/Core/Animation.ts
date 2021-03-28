import Event from "./Event.js"
import Sprite from "./Sprite.js"

export default class Animation extends Event{
    private _sprites: Array<any> = []

    constructor(){
        super()
        this.init()
    }

    private init(){
        let totalDuration: number = 0
        this.on('add', () => {
            totalDuration = 0
            this._sprites.map(o => {totalDuration += o.duration})
        })
        setInterval(() => {
            for (let s = 0; s < this._sprites.length; s++) {
                let o = this._sprites[s]
                setTimeout(() => {
                    this.trigger('change', o.sprite)
                }, o.duration * s)
            }
        }, totalDuration)
    }

    public addSprite(sprite: Sprite, duration: number){
        this._sprites.push({sprite, duration})
        this.trigger('add')
    }
}