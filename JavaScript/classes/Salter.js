const bcrypt = require('bcrypt')

module.exports.Salter = class {
    constructor(){

    }

    static generateRandomToken(){
        return bcrypt.hashSync(Math.floor(Math.random() * 1000000).toString(), 12)
    }

    static hashPassword(password){
        return bcrypt.hashSync(password, 12)
    }

    static verifyPassword(password, hashedPassword){
        return bcrypt.compareSync(password, hashedPassword)
    }
}