class AudioPlayer {
    constructor() {
        var audio = document.createElement('audio');
        audio.id = 'audio-player';
        this.audio = audio;
        this.audio.volume = 1;
        this.loop = false;
        this.isPlaying = false;
        this.logging = false
    }

    setSource(source) {
        this.audio.src = source;
    }
    enablelogging(bool) {
        console.log(bool)
        if (bool == true) {
            this.logging = true;
            console.log("Debugging enabled")
        } else {
            this.logging = false;
            console.log("Debugging disabled")
        }

    }
    toggleLoop() {
        if (this.audio.loop) {
            this.audio.loop = false;
        } else {
            this.audio.loop = true;
        }
    }

    play(source = null) {

        if (source) {
            this.setSource(source);
            this.audio.play();
            this.isPlaying = true;

        } else {
            if (this.audio.src) {
                if (!this.isPlaying) {
                    this.audio.play();
                    this.isPlaying = true;
                } else {
                    console.log('is already playing');
                }
            } else {
                console.log('no source. Use setSource() method.')
            }
        }
    }
    pause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }
    restart() {
        this.audio.currentTime = 0
    }
    mute() {
        if (this.audio.muted) {
            this.audio.muted = false;
        } else {
            this.audio.muted = true
        }
        this.Log("muted");

    }
    audioUP() {
        if (this.audio.volume != 1) {
            this.audio.volume += 0.1;
            this.Log("audio");
        }

    }
    audioDown() {
        if (this.audio.volume >= 0.1) {
            this.audio.volume -= 0.1;
            this.Log("audio");
        }
    }
    Setaudiolevel(audiolevel) {
        this.audio.volume = audiolevel;
        this.Log("audio");
    }
    Log(debug) {
        if (this.logging == true) {
            if (debug == "audio") {
                console.log("volume = " + this.audio.volume.toFixed(1));
            } else if (debug == "muted") {
                console.log("Muted  = " + this.audio.muted)
            }
        }

    }

}

(function () {
    window.audioPlayer = new AudioPlayer();
})();