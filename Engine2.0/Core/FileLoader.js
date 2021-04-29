import { Events } from "./Event.js"

export class FileLoader extends Events{
    #data
    constructor(path, type = ''){
        super()
        this.#init(path, type)
    }

    #init = (path, type) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if(xhr.readyState != 4 || xhr.status != 200) return
            this.#data = type == 'document' ? xhr.responseXML : xhr.responseText
            this.trigger('load', this.#data)
        }
        xhr.responseType = type
        xhr.open('GET', path, true)
        xhr.send()
    }

    get data(){
        return this.#data
    }
}