module.exports.Player = class {
    #username
    #socket

    constructor(username, socket){
        this.#username = username
    }

    get username(){
        return this.#username
    }

    get socket(){
        return this.#socket
    }
}