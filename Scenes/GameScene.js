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

    let logoutButton = new Button(new Vector2(250, window.innerHeight / 2 + 100), new Vector2(250, 30), "OpenLogoutButton", "Logout")
    instance.addElement(logoutButton)

    logoutButton.element.onclick = () => {
        window.socket.emit('logout')
    }

    window.socket.on('logoutSucceeded', () => {

        deleteDataCookie("username")

        window.scenes[0].visible = true
        window.scenes[2].visible = false
    });
}