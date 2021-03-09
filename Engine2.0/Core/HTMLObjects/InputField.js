import { HTMLObject } from '../HTMLObject.js'

export class InputField extends HTMLObject{
    constructor(position, size, type = null){
        let element = document.createElement('input')
        if(type) element.type = type
        super(position, size, element)
        this.#init()
    }

    #init = () => {
        this.element.addEventListener('change', () => {
            
        })

        this.element.addEventListener('input', () => {
            
        })
    }
}