const Model = require("../Classes/Model");

module.exports = class Ban extends Model{
    constructor() {
        super()
    }

    static get tableName(){
        return 'users_ban'
    }
}