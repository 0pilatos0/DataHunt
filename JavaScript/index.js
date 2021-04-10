let { WebServer } = require('./classes/WebServer.js')
let server = new WebServer()

server.on('/', (req, res, html) => {
    html = html.replace('{{PIZZA}}', "Frietjes")
    res.end(html)
})
server.on('/pizza', (req, res, html) => {
    
})

server.post('/', (req, res, data) => {
    console.log(data)
    res.end(JSON.stringify(data))
})
server.run()