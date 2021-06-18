module.exports = class InputParser{
    constructor() {
        
    }

    static parse(value){
        value = value
            .trim()
            .replace(/\\(.)/mg, "$1")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
        return value
    }
}