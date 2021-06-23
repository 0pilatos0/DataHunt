const Model = require("../Classes/Model");

module.exports = class Ad extends Model{
    constructor() {
        super()
    }

    static get tableName(){
        return 'ad'
    }
}