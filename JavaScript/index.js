const { Router } = require('./classes/Router.js')
const { WebServer } = require('./classes/WebServer.js')
let server = new WebServer()

server.get('/', (req, res) => {
    console.log(req.session)
    console.log(res.cookies())
})

server.get('/pizza', (req, res) => {
    req.session.pizza = "123"
    console.log(req.session)
})

server.run()