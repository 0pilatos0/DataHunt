import { FileLoader } from "../Core/FileLoader.js"

export class JSONLoader{
    constructor(path, destinationElement){
        this.#init(path, destinationElement)
    }

    #init = (path) => {
        let loader = new FileLoader(path, 'json')
        loader.on('load', (data) => {
            this.trigger('load', data)
        })
    }
}