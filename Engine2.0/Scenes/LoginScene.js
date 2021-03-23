import { Scene } from "../Core/Scene.js"
import { Vector2 } from "../Core/Vector2.js"
import { InputField } from "../HTMLObjects/InputField.js"
import { Label } from "../HTMLObjects/Label.js"
import { Button } from "../HTMLObjects/Button.js"
import { HTML } from "../Core/HTML.js"

export class LoginScene extends Scene{
    constructor(){
        super()
        this.#init()
    }

    #init = () => {
        new HTML('/Engine2.0/Scenes/LoginScene.html', document.body)
    }

    render = (ctx) => {
        super.render(ctx)
    }

    update = () => {
        super.update()
    }
}