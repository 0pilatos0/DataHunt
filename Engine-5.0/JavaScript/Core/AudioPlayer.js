import Event from "./Event.js";
export default class Inventory extends Event {
    // @ts-ignore: Object is possibly 'null'.
    constructor() {
        super();
        this._isPlaying = false;
        this._audio = document.createElement('audio');
        this._audio.id = 'audio-player';
    }
    setSource(source) {
        this._audio.src = source;
    }
    toggleLoop() {
        if (this._audio.loop) {
            this._audio.loop = false;
        }
        else {
            this._audio.loop = true;
        }
    }
    play(source) {
        if (source) {
            this.setSource(source);
            this._audio.play();
            this._isPlaying = true;
        }
        else {
            if (this._audio.src) {
                if (!this._isPlaying) {
                    this._audio.play();
                }
                else {
                    console.log("this audio instance is already playing");
                }
            }
            else {
                console.log('no source set. Use setSource() method');
            }
        }
    }
    pause() {
        if (this._isPlaying) {
            this._audio.pause();
            this._isPlaying = false;
        }
    }
    restart() {
        this._audio.currentTime = 0;
    }
    toggleMute() {
        if (this._audio.muted) {
            this._audio.muted = false;
        }
        else {
            this._audio.muted = true;
        }
    }
    audioUp() {
        if (this._audio.volume != 1) {
            this._audio.volume += 0.1;
        }
    }
    audioDown() {
        if (this._audio.volume >= 0.1) {
            this._audio.volume -= 0.1;
        }
    }
    setAudioLevel(audioLevel) {
        this._audio.volume = audioLevel;
    }
}
