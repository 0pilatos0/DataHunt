const Model = require("../Classes/Model");

module.exports = class Role extends Model{
    constructor() {
        super()
    }

    static get tableName(){
        return 'user_roles'
    }
}