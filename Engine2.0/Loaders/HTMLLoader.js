import { FileLoader } from "../Core/FileLoader.js"

export class HTMLLoader{
    constructor(path, destinationElement){
        this.#init(path, destinationElement)
    }

    #init = (path, destinationElement) => {
        let loader = new FileLoader(path, 'document')
        loader.on('load', (data) => {
            console.log(data) //TODO fix this returning #document
            //new 
            //document.body.innerHTML += data
            //destinationElement.('afterbegin', data)
        })
    }
}