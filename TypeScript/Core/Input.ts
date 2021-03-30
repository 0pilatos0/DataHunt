import Event from "./Event.js";

document.body.addEventListener('keydown', (e: KeyboardEvent) => {
    Input.keysPressed.push(e.key)
})

document.body.addEventListener('keyup', (e: KeyboardEvent) => {
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