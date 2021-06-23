const bcrypt = require('bcrypt')

module.exports = class Salter {
    constructor(){

    }

    static generateRandomToken(){
        return bcrypt.hashSync(Math.floor(Math.random() * 1000000).toString(), 12)
    }

    static hashPassword(password){
        return bcrypt.hashSync(password, 12)
    }

    static verifyPassword(password, hashedPassword){
        hashedPassword = hashedPassword.replace("$2y", "$2b")
        return bcrypt.compareSync(password, hashedPassword)
    }
}