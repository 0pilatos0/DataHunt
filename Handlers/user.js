const users = require('../sql/users.js')
const mail = require('../mail/connection.js')
const { generateRandomToken, hashPassword, verifyPassword } = require('../Helpers/security.js')

const nameRegex = new RegExp(/^[a-z ,.'-]+$/i)
const usernameRegex = new RegExp(/\w{5,29}/i)
const emailRegex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
const passwordRegex = new RegExp(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&?@"])(?!.*\s).*$/)

module.exports.login = (data) => {
    return new Promise(async (resolve, reject) => {
        if(!(data.username && data.password)) return resolve("All of them must be filled in")
        let userData = await users.getByUsername(data.username)
        if(!userData) return resolve("Username doesn't exist")
        if(!verifyPassword(data.password, userData.password)) return resolve("Wrong password")
        let verified = await users.getVerifiedByUsername(data.username)
        if(!verified) return resolve("Your account hasn't been verified")
        let enabled = await users.getEnabledByUsername(data.username)
        if(!enabled) return resolve("Your account is disabled")
        return resolve(true)
    })
}

module.exports.register = (data) => {
    return new Promise(async (resolve, reject) => {
        if(!(data.name && data.username && data.email && data.password && data.verificationPassword)) return resolve("All of them must be filled in")
        if(!nameRegex.exec(data.name)) return resolve("Name does not match regex")
        if(!usernameRegex.exec(data.username)) return resolve("Username does not match regex")
        if(!emailRegex.exec(data.email)) return resolve("Email does not match regex")
        if(!passwordRegex.exec(data.password)) return resolve("Password does not match regex")
        if(data.password != data.verificationPassword) return resolve("Passwords doesn't match")
        let rememberMe = data.rememberMe
        delete data.rememberMe
        delete data.verificationPassword
        data.password = hashPassword(data.password)
        data.verifytoken = generateRandomToken()
        let createdUser = await users.create(data)
        if(!createdUser) return resolve(createdUser)
        if(rememberMe) await users.addLoginToken(data.username, generateRandomToken())
        let sendMail = await mail.sendMail({to:data.email, subject:data.username, text:"That wasn't that hard, was it?"})
        if(sendMail) return resolve(true)
        else return resolve("Failed sending mail")
    })
}