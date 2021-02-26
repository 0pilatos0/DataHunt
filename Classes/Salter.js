const bcrypt = require('bcrypt')

module.exports.Salter = class {
    constructor(){

    }

    /**
     Generates a random token and returns a string
    **/
    static generateRandomToken(){
        return bcrypt.hashSync(Math.floor(Math.random() * 1000000).toString(), 12)
    }

    /**
     Hashes the password from string and returns hashedpassword as string
     @param {String} password
    **/
    static hasPassword(password){
        return bcrypt.hashSync(password, 12)
    }

    /**
     Verifies the string password and hashed password and return boolean
     @param {String} password
     @param {String} hashedPassword the already hashed password from database
    **/
    static verifyPassword(password, hashedPassword){
        return bcrypt.compareSync(password, hashedPassword)
    }
}