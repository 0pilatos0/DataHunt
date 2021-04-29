import { Scene } from "../Core/Scene.js"
import { Vector2 } from "../Core/Vector2.js"
import { InputField } from "../HTMLObjects/InputField.js"
import { Label } from "../HTMLObjects/Label.js"
import { Button } from "../HTMLObjects/Button.js"
import { HTMLLoader } from "../Loaders/HTMLLoader.js"

export class LoginScene extends Scene{
    constructor(){
        super()
        this.#init()
    }

    #init = () => {
        new HTMLLoader('/Engine2.0/Scenes/LoginScene.html', document.body)
    }

    render = (ctx) => {
        super.render(ctx)
    }

    update = () => {
        super.update()
    }
}