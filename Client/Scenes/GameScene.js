import {Scene} from '../Helpers/Scene.js'
import { Button } from '../Elements/Button.js'
import { Vector2 } from '../Helpers/Vector2.js'
import { deleteDataCookie, getDataCookie } from '../Helpers/Data.js'

export class GameScene extends Scene{
    constructor(){
        super()
        init(this)
    }
}

function init(instance){
    let logoutButton = new Button(new Vector2(0, window.innerHeight / 2), new Vector2(250, 30), "SubmitLogoutButton", "Logout")
    logoutButton.centerX = true
    instance.addElement(logoutButton)
    logoutButton.element.onclick = () => {
        window.socket.emit('logout', {token:getDataCookie('token')})
        deleteDataCookie('token')
        deleteDataCookie('rememberMe')
        location.reload()
    }
}