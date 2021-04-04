import Event from "./Event.js";

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if(Input.keys.indexOf(e.key) == -1) Input.keys.push(e.key)
})

window.addEventListener('keyup', (e: KeyboardEvent) => {
    Input.keys.splice(Input.keys.indexOf(e.key), 1)
})

export default class Input extends Event{
    public static keys: Array<string> = []

    constructor(){
        super()
    }

    public static pressed(key: string){
        return Input.keys.indexOf(key) > -1
    }
}