import { Events } from "./Event.js"

export class FileLoader extends Events{
    #data
    constructor(path){
        super()
        this.#init(path)
    }

    #init = (path) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if(xhr.readyState != 4 || xhr.status != 200) return
            this.#data = xhr.responseText
            this.trigger('load')
        }
        xhr.open('GET', path, true)
        xhr.send()
    }

    get data(){
        return this.#data
    }
}