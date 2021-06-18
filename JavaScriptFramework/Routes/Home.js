const Route = require("../Classes/Route");
const HomeController = require("../Controllers/HomeController");

module.exports = class Home extends Route{
    constructor() {
        super('')

        this.get('/index', HomeController.HandleHome)

        this.get('/login', HomeController.HandleLogin)

        this.get('/register', HomeController.HandleRegister)

        this.post('/login', HomeController.HandlePostLogin)

        this.post('/register', HomeController.HandlePostRegister)

        this.get('/logout', HomeController.HandleLogout)

        this.get('/verification', HomeController.HandleVerification)
    }
}