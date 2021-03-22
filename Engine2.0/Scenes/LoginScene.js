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
        // this.addObject(new Label(new Vector2('45%', '30%')).text = "Username:")
        // this.addObject(new InputField(new Vector2('50%', '30%'),0,'text'))
        // this.addObject(new Label(new Vector2('45%', '35%'), 0).text = "Password:")
        // this.addObject(new InputField(new Vector2('50%', '35%'),0,'password'))
        // this.addObject(new Button(new Vector2('50%', '40%'), 0).text = "Login")
    }

    render = (ctx) => {
        super.render(ctx)
    }

    update = () => {
        super.update()
    }
}