import Event from "./Event.js";
document.body.addEventListener('keydown', (e) => {
    Input.keysPressed.push(e.key);
});
document.body.addEventListener('keyup', (e) => {
    Input.keysPressed.splice(Input.keysPressed.indexOf(e.key), 1);
});
export default class Input extends Event {
    constructor() {
        super();
    }
    static pressed(key) {
        return Input.keysPressed.indexOf(key) > -1;
    }
}
Input.keysPressed = [];
