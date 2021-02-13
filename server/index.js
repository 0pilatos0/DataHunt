const http = require('https').createServer()
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
})
// const sql = require('./sql/sql.js')
// sql.connect.then((e) => {
//   console.log(e)
// })
// sql.users.then((e) => {
//   console.log(e)
// })

io.on('connection', (socket) => {
    console.log("\x1b[32m", `+${socket.id}`)

    socket.on('disconnect', () => {
        console.log("\x1b[31m", `-${socket.id}`)
    })
})

http.listen(`0.0.0.0:${process.env.PORT || 3000}`, () => {
  try{
    console.log(`listening on http://localhost:${process.env.PORT || 3000}`)
  }
  catch(e){
    quit()
    console.log(e)
  }
})

quit = () => {
  //sql.disconnect()
  http.close()
}

process.on('SIGINT', () => {
  quit()
})