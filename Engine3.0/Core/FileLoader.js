import Event from "./Event.js";
export default class FileLoader extends Event {
    constructor(path, type = '') {
        super();
        this.init(path, type);
    }
    init(path, type) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4 || xhr.status != 200)
                return;
            this.trigger('load', xhr.response);
        };
        xhr.responseType = type;
        xhr.open('GET', path, true);
        xhr.send();
    }
}
