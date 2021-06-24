import Event from "./Event.js"

export default class AudioPlayer extends Event{
    
    private _isPlaying : boolean = false
    private _audio : HTMLAudioElement
    // @ts-ignore: Object is possibly 'null'.
    constructor(){
        super()
        this._audio = document.createElement('audio')
        this._audio.id = 'audio-player'
    }

    public setSource(source: string){
        this._audio.src = source
    }

    public toggleLoop(){
        if (this._audio.loop) {
            this._audio.loop = false
        } else {
            this._audio.loop = true
        }
    }

    public play(source: string){
        if (source){
            this.setSource(source)
            this._audio.play()
            this._isPlaying = true
        } else{
            if (this._audio.src){
                if(!this._isPlaying){
                    this._audio.play()
                } else{
                    console.log("this audio instance is already playing")
                }
            } else {
                console.log('no source set. Use setSource() method')
            }
        }
    }

    public pause() {
        if (this._isPlaying){
            this._audio.pause()
            this._isPlaying = false
        }
    }

    public restart() {
        this._audio.currentTime = 0
    }

    public toggleMute(){
        if(this._audio.muted){
            this._audio.muted = false
        } else {
            this._audio.muted = true
        }
    }

    public audioUp(){
        if(this._audio.volume != 1){
            this._audio.volume += 0.1
        }
    }

    public audioDown(){
        if (this._audio.volume >= 0.1) {
            this._audio.volume -= 0.1
        }
    }

    public setAudioLevel(audioLevel: number){
        this._audio.volume = audioLevel
    }
}