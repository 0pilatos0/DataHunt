import Event from "./Event.js";
export default class AnimationController extends Event {
    constructor() {
        super();
        this._animations = [];
        this._activeAnimation = -1;
    }
    set active(index) {
        if (this._activeAnimation > -1)
            this._animations[this._activeAnimation].state = 2 /* PAUSED */;
        this._animations[this._activeAnimation] = this._animations[index];
        this._animations[this._activeAnimation].state = 1 /* PLAYING */;
    }
    get active() {
        return this._activeAnimation;
    }
    add(animation) {
        this._animations.push(animation);
    }
    addMultiple(animations) {
        for (let i = 0; i < animations.length; i++) {
            this._animations.push(animations[i]);
        }
    }
    get activeAnimation() {
        return this._animations[this._activeAnimation];
    }
}
