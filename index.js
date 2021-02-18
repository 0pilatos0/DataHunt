const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
})
const sha256 = require('sha256')
require('dotenv').config()
const sql = require('./sql/connection.js')
sql.connect().then(e => {
  //console.log(e)
})

//const users = require('./sql/users.js')
//const stats = require('./sql/stats.js')
// users.getAll().then(e => {
//   console.log(e)
// })
// users.getByUsername("Pizza").then(e => {
//   console.log(e)
// })
// users.create({name:"Emile Mol",username:"Pizza",email:"test@pizza.nl",phone:"06-123456",password:hashPassword("Test")}).then(e => {
//   console.log(e)
// })
//users.deleteByUsername("Pizza")
// users.updateByUsername("Henk", {username:"Pizza"}).then(e => {
//   console.log(e)
// })
// stats.getAll().then(e => {
//   console.log(e)
// })
// stats.create().then(e => {
//   console.log(e)
// })
//stats.getByUsername("Pizza")
//stats.updateByUsername("Pizza", {coins:100})
const user = require('./Handlers/user.js')
const { generateRandomToken } = require('./Helpers/tokenGenerator.js')

let players = []

io.on('connection', (socket) => {
    console.log("\x1b[32m", `+${socket.id}`)
    
    socket.on('login', (data) => {
      user.login(data).then(e => {
        if(e == true){
          let token = generateRandomToken()
          socket.username = data.username
          socket.token = token
          players.push(socket)
          socket.emit('loginSucceeded', {username:socket.username, token:socket.token})
          console.log(`${socket.username} logged in`)
          //console.log(players)
        }
        else socket.emit('loginFailed', e)
      })
    })

    socket.on('register', (data) => {
      user.register(data).then(e => {
        if(e == true){
          //probably not here
          //log it automaticly in and redirect to game
          let token = generateRandomToken()
          socket.username = data.username
          socket.token = token
          players.push(socket)
          socket.emit('loginSucceeded', {username:socket.username, token:socket.token})
        }
        else socket.emit('registerFailed', e)
      })
    })

    socket.on('logout', (data) => {
      console.log(data)
    })
    
    socket.on('autosave', (data) => {
      console.log(data)
    })

    socket.on('disconnect', () => {
        console.log("\x1b[31m", `-${socket.id}`)
        let index = players.indexOf(socket)
        if(index > -1){
          players.splice(players.indexOf(socket), 1)
          console.log(`${socket.username} logged off`)
        }
        
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
  sql.disconnect()
  http.close()
}

process.on('SIGINT', () => {
  quit()
})