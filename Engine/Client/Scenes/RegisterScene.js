import {Scene} from '../Helpers/Scene.js'
import {InputField} from '../Elements/InputField.js'
import { Button } from '../Elements/Button.js'
import { Label } from '../Elements/Label.js'
import { Vector2 } from '../Helpers/Vector2.js'
import { setDataCookie, setDataSocket } from '../Helpers/Data.js'

export class RegisterScene extends Scene{
    constructor(){
        super()
        init(this)
    }
}

function init(instance){
    let errorLabel = new Label(new Vector2(0, window.innerHeight / 2 - 400), new Vector2(250, 15), "ErrorRegisterLabel", "Error:")
    let nameLabel = new Label(new Vector2(0, window.innerHeight / 2 - 350), new Vector2(250, 15), "NameRegisterLabel", "Name:")
    let nameInputField = new InputField(new Vector2(0, window.innerHeight / 2 - 300), new Vector2(250, 15))
    let usernameLabel = new Label(new Vector2(0, window.innerHeight / 2 - 250), new Vector2(250, 15), "UsernameRegisterLabel", "Username:")
    let usernameInputField = new InputField(new Vector2(0, window.innerHeight / 2 - 200), new Vector2(250, 15))
    let emailLabel = new Label(new Vector2(0, window.innerHeight / 2 - 150), new Vector2(250, 15), "EmailRegisterLabel", "Email:")
    let emailInputField = new InputField(new Vector2(0, window.innerHeight / 2 - 100), new Vector2(250, 15))
    //let phoneLabel = new Label(new Vector2(0, window.innerHeight / 2 - 50), new Vector2(250, 15), "PhoneRegisterLabel", "Phone:")
    //let phoneInputField = new InputField(new Vector2(0, window.innerHeight / 2), new Vector2(250, 15))
    let passwordLabel = new Label(new Vector2(0, window.innerHeight / 2 - 50), new Vector2(250, 15), "PasswordRegisterLabel", "Password:")
    let passwordInputField = new InputField(new Vector2(0, window.innerHeight / 2), new Vector2(250, 15))
    let verifyPasswordLabel = new Label(new Vector2(0, window.innerHeight / 2 + 50), new Vector2(250, 15), "VerifyPasswordRegisterLabel", "Verify Password:")
    let verifyPasswordInputField = new InputField(new Vector2(0, window.innerHeight / 2 + 100), new Vector2(250, 15))
    //let rememberMeCheckbox = new Button(new Vector2(0, window.innerHeight / 2 + 150), new Vector2(250, 30), "RememberMeButton", "Remember Me")
    let submitButton = new Button(new Vector2(0, window.innerHeight / 2 + 200), new Vector2(250, 30), "SubmitRegisterButton", "Register")
    let loginPageButton = new Button(new Vector2(300, window.innerHeight / 2 + 200), new Vector2(250, 30), "OpenLoginButton", "Login")
    nameLabel.centerX = true
    nameInputField.centerX = true
    passwordLabel.centerX = true
    usernameInputField.centerX = true
    passwordInputField.centerX = true
    usernameLabel.centerX = true
    submitButton.centerX = true
    emailLabel.centerX = true
    emailInputField.centerX = true
    //phoneLabel.centerX = true
    //phoneInputField.centerX = true
    loginPageButton.centerX = true
    verifyPasswordLabel.centerX = true
    verifyPasswordInputField.centerX = true
    //rememberMeCheckbox.centerX = true
    errorLabel.centerX = true
    //rememberMeCheckbox.element.style.backgroundColor = "red"
    submitButton.element.onclick = () => {
        errorLabel.element.innerHTML = `Error:`
        //, phone:phoneInputField.element.value
        window.socket.emit("register", {name:nameInputField.element.value, username:usernameInputField.element.value, email:emailInputField.element.value, password:passwordInputField.element.value, verificationPassword:verifyPasswordInputField.element.value})//, rememberMe:rememberMeCheckbox.element.style.backgroundColor == "green" ? true : false})
        //setDataCookie('rememberMe', rememberMeCheckbox.element.style.backgroundColor == "green" ? true : false)
    }
    loginPageButton.element.onclick = () => {
        window.scenes[1].visible = false
        window.scenes[0].visible = true
    }
    // rememberMeCheckbox.element.onclick = () => {
    //     rememberMeCheckbox.element.style.backgroundColor = rememberMeCheckbox.element.style.backgroundColor == "green" ? "red" : "green" 
    // }
    instance.addElement(nameLabel)
    instance.addElement(nameInputField)
    instance.addElement(usernameLabel)
    instance.addElement(usernameInputField)
    instance.addElement(passwordLabel)
    instance.addElement(passwordInputField)
    instance.addElement(submitButton)
    instance.addElement(emailLabel)
    instance.addElement(emailInputField)
    //instance.addElement(phoneLabel)
    //instance.addElement(phoneInputField)
    instance.addElement(loginPageButton)
    instance.addElement(verifyPasswordLabel)
    instance.addElement(verifyPasswordInputField)
    instance.addElement(errorLabel)
    //instance.addElement(rememberMeCheckbox)
    window.socket.on('registerFailed', (data) => {
        errorLabel.element.innerHTML = `Error: ${data}`
    })
    window.socket.on('registerSucceeded', (data) => {
        //setDataSocket("username", data.username)
        location.reload()
        // window.scenes[1].visible = false
        // window.scenes[2].visible = true
    })
}