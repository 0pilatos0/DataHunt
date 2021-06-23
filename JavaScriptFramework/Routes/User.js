const Route = require("../Classes/Route");
const UserController = require("../Controllers/UserController");

module.exports = class User extends Route{
    constructor() {
        super('')

        this.get('/user', UserController.HandleUser)

        this.post('/user', UserController.HandlePostUser)

        this.get('/character', UserController.HandleCharacters)
    }
}