const { DiscordAPI } = require("../Classes/DiscordAPI")
const { Salter } = require("../Classes/Salter")
const { User } = require("../Helpers/User")
const { Mailer } = require("../Classes/Mailer")
const fs = require('fs')

module.exports.login = async (socket, data) => {
    if(Object.values(data).some(d => d === "" || d.toString().trim().length === 0)) return socket.emit('failedLogin', {message:'Each field must be filled'})
    let exists = await User.exists(data.username)
    if(exists){
        let user = new User(data.username)
        user.on('load', async () => {
            if(!user.verified) return socket.emit('failedLogin', {message:'You haven\'t verified your account!'})
            if(!user.enabled) return socket.emit('failedLogin', {message:'Your account is banned'})
            if(!Salter.verifyPassword(data.password, user.password)) return socket.emit('failedLogin', {message:'Credentials are incorrect'})
            socket.user = user
            if(data.rememberme) {
                await user.createLoginToken(Salter.generateRandomToken())
                socket.emit('succeededLogin', {token:user.loginTokens[user.loginTokens.length - 1], message:'Successfully logged in'})
                DiscordAPI.sendMessage(`+${user.username}`)
            }
            else{
                socket.emit('succeededLogin', {message:'Successfully logged in'})
                DiscordAPI.sendMessage(`+${user.username}`)
            }
        })
    }
    else{
        return socket.emit('failedLogin', {message:'Credentials are incorrect'})
    }
}

module.exports.register = async (socket, data) => {
    if(Object.values(data).some(d => d === "" || d.toString().trim().length === 0)) return socket.emit('failedRegister', {message:'Each field must be filled'})
    if(!data.name.match(global.nameRegex)) return socket.emit('failedRegister', {message:'Name doesn\'t match requirements'})
    if(!data.username.match(global.usernameRegex)) return socket.emit('failedRegister', {message:'Username doesn\'t match requirements'})
    if(!data.email.match(global.emailRegex)) return socket.emit('failedRegister', {message:'Email doesn\'t match requirements'})
    if(!data.password.match(global.passwordRegex)) return socket.emit('failedRegister', {message:'Passwords doesn\'t match requirements'})
    if(!data.passwordcheck.match(global.passwordRegex)) return socket.emit('failedRegister', {message:'Password doesn\'t match requirements'})
    if(data.password !== data.passwordcheck) return socket.emit('failedRegister', {message:'Passwords doesn\'t match'})
    let exists = await User.exists(data.username)
    if(exists) return socket.emit('failedRegister', {message:'There\'s already an account with that username'})
    let user = await User.new(data.name, data.username, data.email, Salter.hashPassword(data.password))
    user.on('load', async () => {
        let sendMail = await Mailer.sendMail({to:data.email, subject:'Verify email Datahunt', html:fs.readFileSync(`${__dirname}/../../Mail/htmlmail.html`, {encoding:'utf8', flag:'r'}).replace('{TOKEN}', user.verificationToken).replace("{{USERNAME}}", user.username)})
        if(!sendMail) return socket.emit('failedRegister', {message:'Sending mail failed'})
        socket.emit('succeededRegister', {message:'Go and check your email'})
    })
}

module.exports.logout = async (socket, data, players) => {
    DiscordAPI.sendMessage(`-${socket.user.username}`)
}

module.exports.disconnect = async (socket, data, players) => {
    console.log("\x1b[31m", `-${socket.id}`)
    socket.emit('disconnected')
}