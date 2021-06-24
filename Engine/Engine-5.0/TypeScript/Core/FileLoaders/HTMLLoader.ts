import Event from "../Event.js"

export default class HTMLLoader extends Event{
    constructor(path: string){
        super()
        let xhr = new XMLHttpRequest()
        xhr.onload = () => { this.trigger('load', xhr.responseText) }
        xhr.open('GET', path, true)
        xhr.send()
    }
}