const Model = require("../Classes/Model");

module.exports = class ProfilePicture extends Model{
    constructor() {
        super()
    }

    static get tableName(){
        return 'profile_pictures'
    }
}