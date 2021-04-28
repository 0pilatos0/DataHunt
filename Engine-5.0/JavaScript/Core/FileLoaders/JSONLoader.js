import Event from "../Event.js";
export default class JSONLoader extends Event {
    constructor(path) {
        super();
        let xhr = new XMLHttpRequest();
        xhr.onload = () => { this.trigger('load', JSON.parse(xhr.response)); };
        xhr.open('GET', path, true);
        xhr.send();
    }
}
