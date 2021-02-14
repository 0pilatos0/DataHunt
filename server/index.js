const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
})
const sql = require('./sql/sql.js')
sql.connect.then((e) => {
  console.log(e)
})
sql.users.then((e) => {
  console.log(e)
})

io.on('connection', (socket) => {
    console.log("\x1b[32m", `+${socket.id}`)

    socket.on('disconnect', () => {
        console.log("\x1b[31m", `-${socket.id}`)
    })
})

http.listen(`${process.env.PORT || 3000}`, () => {
  try{
    if(!process.env.PORT)
      console.log(`listening on http://localhost:3000`)
    else
      console.log(`listening on https://datahuntserver.herokuapp.com`)
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