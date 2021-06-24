const Route = require("../Classes/Route");
const AdminController = require("../Controllers/AdminController");

module.exports = class Admin extends Route{
    constructor() {
        super('')

        this.get('/admin', AdminController.HandleAdmin)

        this.post('/admin', AdminController.HandleAdminPost)
    }
}