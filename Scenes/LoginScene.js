import {Scene} from '../Helpers/Scene.js'
import {InputField} from '../Elements/InputField.js'
import { Button } from '../Elements/Button.js'
import { Label } from '../Elements/Label.js'
import { Vector2 } from '../Helpers/Vector2.js'
import { setDataCookie, setDataSocket, setDataWindow } from '../Helpers/Data.js'

export class LoginScene extends Scene{
    constructor(){
        super()
        init(this)
    }
}

function init(instance){
    let errorLabel = new Label(new Vector2(0, window.innerHeight / 2 - 300), new Vector2(250, 15), "ErrorRegisterLabel", "Error:")
    let usernameLabel = new Label(new Vector2(0, window.innerHeight / 2 - 250), new Vector2(250, 15), "UsernameLoginLabel", "Username:")
    let usernameInputField = new InputField(new Vector2(0, window.innerHeight / 2 - 200), new Vector2(250, 15))
    let passwordLabel = new Label(new Vector2(0, window.innerHeight / 2 - 150), new Vector2(250, 15), "PasswordLoginLabel", "Password:")
    let passwordInputField = new InputField(new Vector2(0, window.innerHeight / 2 - 100), new Vector2(250, 15))
    let submitButton = new Button(new Vector2(0, window.innerHeight / 2 - 50), new Vector2(250, 30), "SubmitLoginButton", "Login")
    let registerPageButton = new Button(new Vector2(300, window.innerHeight / 2 - 50), new Vector2(250, 30), "OpenRegisterButton", "Register")
    passwordLabel.centerX = true
    usernameInputField.centerX = true
    passwordInputField.centerX = true
    registerPageButton.centerX = true
    usernameLabel.centerX = true
    submitButton.centerX = true
    errorLabel.centerX = true
    submitButton.element.onclick = () => {
        errorLabel.element.innerHTML = `Error:`
        window.socket.emit("login", {username:usernameInputField.element.value, password:passwordInputField.element.value})
    }
    registerPageButton.element.onclick = () => {
        window.scenes[0].visible = false
        window.scenes[1].visible = true
    }
    instance.addElement(usernameLabel)
    instance.addElement(usernameInputField)
    instance.addElement(passwordLabel)
    instance.addElement(passwordInputField)
    instance.addElement(submitButton)
    instance.addElement(registerPageButton)
    instance.addElement(errorLabel)
    window.socket.on('loginFailed', (data) => {
        errorLabel.element.innerHTML = `Error: ${data}`
    })
    window.socket.on('loginSucceeded', (data) => {
        setDataSocket("token", data.token)
        setDataCookie("token", data.token)
        setDataSocket("username", data.username)
    })
}