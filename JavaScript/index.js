let { WebServer } = require('./classes/WebServer.js')
let server = new WebServer()

server.get('/', (req, res) => {
    // Object.keys(req.data).map(d => {
    //     req.vars[d] = req.data[d]
    // })
})

server.get('/pizza', (req, res, html) => {
    
})

server.post('/', (req, res) => {
    console.log(req.data)
})

server.get(`/users/:username`, (req, res) => {
    console.log(req.params)
    console.log(req.data)
    // server.on('/hallo', (req, res) => {
    //     console.log("????")
    // })
})

server.run()