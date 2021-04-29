import Event from "./Event.js";
export default class Img extends Event {
    constructor(src) {
        super();
        let img = new Image();
        img.onload = () => {
            this.trigger('load', img);
        };
        img.src = src;
    }
}
