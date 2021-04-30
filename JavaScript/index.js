const { Router } = require('./classes/Router.js')
const { WebServer } = require('./classes/WebServer.js')
let server = new WebServer()

server.get('/', (req, res) => {
    // Object.keys(req.data).map(d => {
    //     req.vars[d] = req.data[d]
    // })
    // console.log(req.vars)
    // console.log(req.data)
    //req.vars.PIZZA = `<script>let pizza = "${req.data.pizza}"</script>`
    //req.vars.pizza = req.data.PIZZA
    //console.log(req.vars)
    // req.session = []
    // req.session.pizza = "123"
    console.log(req.session)
    
    // res.createSession()
    // console.log(req.session)
})

server.get('/pizza', (req, res, html) => {
    req.session = {pizza: "123"}
    //req.session.
    //console.log(req.session)
})

server.post('/', (req, res) => {
    //console.log(req.data)
})

server.get('/:id', (req, res) => {
    //console.log(req.params)
    console.log(req.session)
})

let r = new Router('/test', server)
r.get('/pizza', (req, res) => {console.log("?")})
//r.get('/', (req, res) => {console.log("???")})
r.get('/:id/:iegni/:username/:pizza', (req, res) => {})//console.log(req.params)

server.get(`/users/:username`, (req, res) => {
    // req.vars.username = req.params.username
    // req.vars.id = req.data.id
})

server.get('/users/:username/:name/:id', (req, res) => {
    //console.log(req.params)
})

server.get('/users/:username/pizza', (req, res) => {
    console.log(req.data)
    console.log(req.params)
    res.redirect('/404')
})

server.run()