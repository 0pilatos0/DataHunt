import Event from "./Event.js";
window.addEventListener('keydown', (e) => {
    if (Input.keys.indexOf(e.key) == -1)
        Input.keys.push(e.key);
});
window.addEventListener('keyup', (e) => {
    Input.keys.splice(Input.keys.indexOf(e.key), 1);
});
export default class Input extends Event {
    constructor() {
        super();
    }
    static pressed(key) {
        return Input.keys.indexOf(key) > -1;
    }
}
Input.keys = [];
