const Model = require("../Classes/Model");

module.exports = class Friend extends Model{
    constructor() {
        super()
    }

    static async acceptFriendship(id){
        this.update({
            data:{
                friendship:1
            },
            where:{
                id
            }
        })
    }

    static async declineFriendship(id){
        this.delete({
            where: {
                id
            }
        })
    }
}