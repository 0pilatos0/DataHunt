import Event from "./Event.js";

export default class FileLoader extends Event{
    constructor(path: string){
        super()
        let xhr = new XMLHttpRequest()
        xhr.onload = () => {
            this.trigger('load', JSON.parse(xhr.response))
        }
        xhr.open('GET', path)
        xhr.send()
    }
}