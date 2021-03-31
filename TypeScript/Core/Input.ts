import Event from "./Event.js";

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if(Input.keysPressed.indexOf(e.key) == -1) Input.keysPressed.push(e.key)
})

window.addEventListener('keyup', (e: KeyboardEvent) => {
    Input.keysPressed.splice(Input.keysPressed.indexOf(e.key), 1)
})

export default class Input extends Event{
    public static keysPressed: Array<string> = []

    constructor(){
        super()
    }

    public static pressed(key: string){
        return Input.keysPressed.indexOf(key) > -1
    }
}