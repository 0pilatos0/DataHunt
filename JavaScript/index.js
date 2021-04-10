let { WebServer } = require('./classes/WebServer.js')
let server = new WebServer()

server.on('/', (req, res) => {
    //req.html = req.html.replace('{{PIZZA}}', req.data.pizza)
    //req.vars.PIZZA = req.data.pizza
    //console.log(req.vars)
})

server.on('/pizza', (req, res, html) => {
    
})

server.post('/', (req, res) => {
    console.log(req.data)
})

server.run()