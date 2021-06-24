import Event from "./Event.js"

export default class Image extends Event{
    constructor(src: string){
        super()
        let img = document.createElement('img')
        img.onload = () => { this.trigger('load', img) }
        img.src = src
    }
}