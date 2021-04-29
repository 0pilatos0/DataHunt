import { Vector2 } from "../Helpers/Vector2.js"

export class BaseElement{
    #position
    #size
    #element
    #name
    #centerX = false
    #centerY = false
    #visible = true

    constructor(position, size){
        if(!(position instanceof Vector2)) position = new Vector2(0, 0)
        if(!(size instanceof Vector2)) size = new Vector2(0, 0)
        this.#name = name
        this.#position = position
        this.#size = size
    }

    set position(position){
        if(!(position instanceof Vector2)) return
        this.#position = position
        rePosition(this)
    }

    get position(){
        return this.#position
    }

    set size(size){
        if(!(size instanceof Vector2)) return
        this.#size = size
        reSize(this.#element, this.#size)
    }

    get size(){
        return this.#size
    }

    set name(name){
        this.#name = name
        this.#element.name = this.#name
    }

    get name(){
        return this.#name
    }

    set centerX(bool){
        this.#centerX = bool
        this.reDraw()
    }

    set centerY(bool){
        this.#centerY = bool
        this.reDraw()
    }

    get centerX(){
        return this.#centerX
    }

    get centerY(){
        return this.#centerY
    }

    get element(){
        return this.#element
    }

    set element(element){
        this.#element = element
    }

    set visible(visible){
        this.#visible = visible
        this.#element.style.display = (visible ? "block" : "none")
    }
    
    get visible(){
        return this.#visible
    }

    reDraw(){
        rePosition(this)
        reSize(this)
    }
}

function rePosition(instance){
    let tX, tY
    if(instance.centerX) tX = window.innerWidth / 2 + instance.position.x - instance.size.x / 2
    if(instance.centerY) tY = window.innerHeight / 2 + instance.position.x - instance.size.y / 2
    instance.element.style.left = (tX || instance.position.x) + "px"
    instance.element.style.top = (tY || instance.position.y) + "px"
}

function reSize(instance){
    instance.element.style.width = `${instance.size.x}px`
    instance.element.style.height = `${instance.size.y}px`
}