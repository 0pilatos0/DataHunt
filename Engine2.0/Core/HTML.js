import { FileLoader } from "./FileLoader.js"

export class HTML{
    constructor(path, destinationElement){
        this.#init(path, destinationElement)
    }

    #init = (path, destinationElement) => {
        let loader = new FileLoader(path)
        loader.on('load', () => {
            destinationElement.insertAdjacentHTML('afterbegin', loader.data)
        })
    }
}