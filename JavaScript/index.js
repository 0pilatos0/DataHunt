const { Router } = require('./classes/Router.js')
const { Salter } = require('./classes/Salter.js')
const { WebServer } = require('./classes/WebServer.js')
const { Functions } = require('./helpers/Functions.js')
const { User } = require('./helpers/User.js')
const { Mailer } = require('./classes/Mailer.js')
const fs = require('fs')
let server = new WebServer()

server.get('/', (req, res) => {
    
})

server.get('/logout', async (req, res) => {
    if(!req.session.user){
        res.redirect('/')
    }
    await global.sql.query(`DELETE FROM logintokens WHERE user_id = ${req.session.user}`)
    Object.keys(req.session).map(k => {
        if(k != 'id') delete req.session[k]
    })
    res.redirect('/')
    res.end()
})

server.get('/register', (req, res) => {
    if(req.session.user){
        res.redirect('/')
    }
    req.vars.FEEDBACK = req.session.registerFeedback
    req.vars.NAME = req.session.name
    req.vars.USERNAME = req.session.username
    req.vars.EMAIL = req.session.email
    delete req.session.name
    delete req.session.username
    delete req.session.email
})

server.post('/register', async (req, res) => {
    let name = Functions.changeInput(req.data["AccName"])
    let username = Functions.changeInput(req.data["AccUsername"])
    let email = Functions.changeInput(req.data["AccEmail"])
    let password = Salter.hashPassword(Functions.changeInput(req.data["AccPassword"]))
    let verificationToken = Salter.generateRandomToken()
    let nameRegex = /^[a-z ,.\'-]+$/i
    let usernameRegex = /\w{5,29}/i
    let emailRegex = /(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(!name.match(nameRegex)){
        req.session.username = username
        req.session.name = name
        req.session.email = email
        req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">You are the type of person to have a red line under your name in word.</div>`
        res.redirect('/register')
        return
    }
    if(!username.match(usernameRegex)){
        req.session.username = username
        req.session.name = name
        req.session.email = email
        req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>`
        res.redirect('/register')
        return
    }
    if(!email.match(emailRegex)){
        req.session.username = username
        req.session.name = name
        req.session.email = email
        req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">This isn't a valid email adress!</div>`
        res.redirect('/register')
        return
    }
    if(!req.data["AccPassword"].match(passwordRegex)){
        req.session.username = username
        req.session.name = name
        req.session.email = email
        req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your password should be 8 characters long, have one uppercase and lowercase letters and a number!</div>`
        res.redirect('/register')
        return
    }
    if(req.data["AccPassword"] !== req.data["AccPasswordCheck"]){
        req.session.username = username
        req.session.name = name
        req.session.email = email
        req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Passwords don't match!</div>`
        res.redirect('/register')
        return
    }
    let exists = await User.getUserId(username)
    if(exists){
        req.session.username = username
        req.session.name = name
        req.session.email = email
        req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Username already in use</div>`
        res.redirect('/register')
        return
    }
    await global.sql.query(`INSERT INTO users (name, username, email, password, verifytoken) VALUES ('${name}', '${username}', '${email}', '${password}', '${verificationToken}')`)
    let user = await User.get(username)
    await global.sql.query(`INSERT INTO logintokens (user_id, token) VALUES (${user.id}, '${verificationToken}')`)
    await global.sql.query(`INSERT INTO user_roles (user_id, role_id) VALUES (${user.id}, 0)`)
    await Mailer.sendMail({to:email, subject:'Verify email Datahunt', html:fs.readFileSync(`../Mail/htmlmail.html`, {encoding:'utf8', flag:'r'}).replace('{TOKEN}', verificationToken)})
    res.redirect('/')
})

server.get('/login', (req, res) => {
    if(req.session.user){
        res.redirect('/')
    }
    req.vars.FEEDBACK = req.session.loginFeedback
    req.vars.USERNAME = req.session.username
    delete req.session.username
    delete req.session.loginFeedback
})

server.post('/login', async (req, res) => {
    let username = Functions.changeInput(req.data["AccUsername"])
    let password = Functions.changeInput(req.data["AccPassword"])
    let token = Salter.generateRandomToken()
    res.cookie("token", token)
    let usernameRegex = /\w{5,29}/i
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    req.session.loginFeedback = ""
    if(!username.match(usernameRegex)){
        req.session.loginFeedback += `<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>`
        req.session.username = username
        res.redirect('/login')
        return
    }
    if(!password.match(passwordRegex)){
        req.session.loginFeedback += `<div class=\"alert alert-danger\" role=\"alert\">Password is incorrect!</div>`
        req.session.username = username
        res.redirect('/login')
        return
    }
    let user = await global.sql.query(`SELECT * FROM users WHERE username = ('${username}') AND enabled = 1 and verified = 1`)
    if(Salter.verifyPassword(password, user.password)){
        req.session.user = user.id
        if(req.data["AccRemember"] === "on"){
            await global.sql.query(`INSERT INTO logintokens (user_id, token) VALUES (${user.id}, '${Salter.generateRandomToken()}')`)
            res.redirect('/')
        }
    }
    else{
        req.session.username = username
        req.session.loginFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Invalid credentials!</div>`
    }
    res.redirect('/login')
})

server.get('/admin', async (req, res) => {
    if(!req.session.userinfo || !req.session.userinfo["role_id"]) res.redirect('/')
    req.vars["DYNAMICDATA"] = ''
    if(req.data.delete){
        if(req.data.delete === "true"){
            req.vars["DYNAMICDATA"] = `
                <div id=\"delete-account-overlay\" onclick='removeOverlay()' class=\"overlay delete-element\">
                    
                </div>
                <div class=\"delete-confirm delete-element\">
                    <h3>Are you sure you want to delete your account?</h3>
                    <button id=\"cancel\" onclick=\"removeOverlay()\" class=\"btn btn-cancel\">Cancel</button>
                    <a href=\"?delete=confirm&id={$_GET["id"]}\" class=\"btn btn-confirm\">Confirm</a>
                </div>`
        }
        else if(req.data.delete === "confirm"){
            req.vars["DYNAMICDATA"] = ''
            await Functions.adminDelete(req.data.id)
            res.redirect('/admin')
        }
    }
    req.vars["USERS"] = ""
    let users = await User.getMultiple()
    users.map(user => {
        req.vars["USERS"] += `
            <tr>
            <td>${user["id"]}</td>
            <td>${user["name"]}</td>
            <td>${user["username"]}</td>
            <td>${user["email"]}</td>
            <td>${user["enabled"]}</td>
            <td>${user["verified"]}</td>
            <td>${user["role_id"]}</td>
            
            <td>
            <a href=\"?ban=true&id=${user["id"]}\"><i class=\"fas fa-ban\"></i></a>
            <a href=\"?delete=true&id=${user["id"]}\"><i class=\"fas fa-trash\"></i></a>
            </td>
            </tr>
        `
    })
})

server.run()