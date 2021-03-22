export class HTML{
    constructor(path, destinationElement){
        this.#init(path, destinationElement)
    }

    #init = (path, destinationElement) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if(xhr.readyState != 4 || xhr.status != 200) return
            destinationElement.insertAdjacentHTML('afterbegin', xhr.responseText)
        }
        xhr.open('GET', path, true)
        xhr.send()
    }
}