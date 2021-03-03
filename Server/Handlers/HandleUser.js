const { Mailer } = require("../Classes/Mailer")
const { Salter } = require("../Classes/Salter")
const { getVerifiedByToken, getEnabledByToken, create, getUsernameByLoginToken, deleteLoginToken, addLoginToken, getByUsername, getVerifiedByUsername, getEnabledByUsername } = require("./HandleUserQueries.js")

const nameRegex = new RegExp(/^[a-z ,.'-]+$/i)
const usernameRegex = new RegExp(/\w{5,29}/i)
const emailRegex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

module.exports.login = async (data, socket, players, bot, sql) => {
    //return new Promise(async (resolve, reject) => {
        if(data.token){
            if(!data.rememberMe) return socket.emit('logout')
            let username = await getUsernameByLoginToken(sql, data.token)
            if(!username) return socket.emit('logout')
            let verified = await getVerifiedByToken(sql, data.token)
            if(!verified) return socket.emit('loginFailed', "Your account hasn't been verified")
            let enabled = await getEnabledByToken(sql, data.token)
            if(!enabled) return socket.emit('loginFailed', "Your account is disabled")
            deleteLoginToken(sql, username, data.token)
            let token = Salter.generateRandomToken()
            addLoginToken(sql, username, token)
            socket.username = username
            players.push(socket)
            socket.emit('loginSucceeded', {username, token})
            await bot.sendMessage(`✅ ${socket.username}`)
            console.log(`${socket.username} logged in`)
        }
        if(players.indexOf(socket) != -1) return
        if(!(data.username && data.password)) return socket.emit('loginFailed', "All of them must be filled in")
        let userData = await getByUsername(sql, data.username)
        if(!userData) return socket.emit('loginFailed', "Username doesn't exist")
        if(!verifyPassword(data.password, userData.password)) return socket.emit('loginFailed', "Wrong password")
        let verified = await getVerifiedByUsername(sql, data.username)
        if(!verified) return socket.emit('loginFailed', "Your account hasn't been verified")
        let enabled = await getEnabledByUsername(sql, data.username)
        if(!enabled) return socket.emit('loginFailed', "Your account is disabled")
        socket.username = data.username
        players.push(socket)
        let token = Salter.generateRandomToken()
        addLoginToken(sql, username, token)
        socket.emit('loginSucceeded', {username:socket.username, token})
        await bot.sendMessage(`✅ ${socket.username}`)
        console.log(`${socket.username} logged in`)
    //})
}

module.exports.register = async (data, socket, players, bot, sql) => {
    //return new Promise(async (resolve, reject) => {
        if(!(data.name && data.username && data.email && data.password && data.verificationPassword)) return socket.emit('registerFailed', "All of them must be filled in")
        if(!nameRegex.exec(data.name)) return socket.emit('registerFailed', "Name does not match regex")
        if(!usernameRegex.exec(data.username)) return socket.emit('registerFailed', "Username does not match regex")
        if(!emailRegex.exec(data.email)) return socket.emit('registerFailed', "Email does not match regex")
        if(!passwordRegex.exec(data.password)) return socket.emit('registerFailed', "Password does not match regex")
        if(data.password != data.verificationPassword) return socket.emit('registerFailed', "Passwords doesn't match")
        //let rememberMe = data.rememberMe
        //delete data.rememberMe
        delete data.verificationPassword
        data.password = Salter.hashPassword(data.password)
        data.verifytoken = Salter.generateRandomToken()
        let createdUser = await create(sql, data)
        if(createdUser != true) return socket.emit('registerFailed', createdUser)
        let token = Salter.generateRandomToken()
        //if(rememberMe) await addLoginToken(sql, data.username, token)
        let url = `http://datahunt.duckdns.org/Website/pages/verification?veri=${data.verifytoken}`
        let sendMail = await Mailer.sendMail({to:data.email, subject:'Verify email Datahunt', html:`
            <style>
                *{user-select: none;}
                body{
                    margin: 0;
                    text-align: center;
                }
                #verify{
                    color: black;
                    text-decoration: none;
                    border: 25px solid blue;
                    background: blue;
                }
                #verify:hover{
                    background: lightblue;
                    border-color: lightblue;
                }
            </style>
            <h2>Datahunt</h2>
            <p>
                Hi ${data.username},<br>
                <br>
                Thanks for joining us! :D <br>
                You can verify your email using the button below or by copying the following link: ${url}<br>
                <br><br>
                <a id="verify" href="${url}">Verify email</a>
            </p>
            <script>
            
            </script>`
        })
        if(sendMail != true) return socket.emit('registerFailed', 'Sending mail failed')
        //let returnData = {}
        //if(rememberMe) returnData.token = token //await getLoginTokenByUsername(sql, data.username).then(t => {returnData.token = t})
        socket.username = data.username
        //players.push(socket)
        socket.emit('registerSucceeded', {username:socket.username})
        //await bot.sendMessage(`✅ ${socket.username}`)
        console.log(`${socket.username} registered`)
        //user gotta verifiy first and when done verifying, reload page to play! :D
        
    //})
}

module.exports.logout = async (socket,players, bot) => {
    this.disconnect(socket, players, bot)
}

module.exports.disconnect = async (socket, players, bot) => {
    console.log("\x1b[31m", `-${socket.id}`)
    let index = players.indexOf(socket)
    if(index > -1){
        players.splice(players.indexOf(socket), 1)
        console.log(`${socket.username} disconnected`)
        bot.sendMessage(`❌ ${socket.username}`)
    }
}