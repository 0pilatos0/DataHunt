import Event from "./Event.js";
export default class AnimationController extends Event {
    constructor() {
        super();
        this._animations = [];
        this._activeAnimation = 0;
    }
    set active(index) {
        this._animations[this._activeAnimation].state = 2 /* PAUSED */;
        this._activeAnimation = index;
        this._animations[this._activeAnimation].state = 1 /* PLAYING */;
    }
    get active() {
        return this._activeAnimation;
    }
    add(animation) {
        this._animations.push(animation);
    }
    addMultiple(animations) {
        animations.map((a) => {
            this._animations.push(a);
        });
    }
    get activeAnimation() {
        return this._animations[this._activeAnimation];
    }
}
