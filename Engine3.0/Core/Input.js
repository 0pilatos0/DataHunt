import Event from "./Event.js";
window.addEventListener('keydown', (e) => {
    if (Input.keysPressed.indexOf(e.key) == -1)
        Input.keysPressed.push(e.key);
});
window.addEventListener('keyup', (e) => {
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
