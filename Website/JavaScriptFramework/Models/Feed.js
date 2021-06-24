const Model = require("../Classes/Model");

module.exports = class Feed extends Model{
    constructor() {
        super()
    }

    static get tableName(){
        return 'users_feed'
    }
}