const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: {
      origin: "*"
    }
  })

io.on('connection', (socket) => {
    console.log("\x1b[32m", `+${socket.id}`)

    socket.on('disconnect', () => {
        console.log("\x1b[31m", `-${socket.id}`)
    })
})

http.listen(3000, () => {
    console.log("listening on http://localhost:3000")
})