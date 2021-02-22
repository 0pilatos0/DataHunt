const http = require('http').createServer()
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
})

require('dotenv').config()
const sql = require('./sql/connection.js')
sql.connect().then(e => {
  //console.log(e)
})

const user = require('./Handlers/user.js')
const { generateRandomToken } = require('./Helpers/security.js')
const { getUsernameByLoginToken, getLoginTokenByUsername, deleteLoginToken, addLoginToken } = require('./sql/users.js')

let players = []

setInterval(() => {
  sql.sqlCon.query("DELETE FROM logintokens WHERE creationdate < NOW() - INTERVAL 30 DAY", (err, result, fields) => {
    if(err) throw err
  })
}, 1000 * 60 * 60 * 24);

io.on('connection', async (socket) => {
    console.log("\x1b[32m", `+${socket.id}`)
    //create something for deleting token when it isn;t used for real long time 
    //if older than 30 days remove
    socket.on('login', async (data) => {
      if(data.token){
        if(!data.rememberMe) return socket.emit('logout')
        let token = generateRandomToken()
        let username = await getUsernameByLoginToken(data.token)
        if(!username) return socket.emit('logout')
        deleteLoginToken(username, data.token)
        addLoginToken(username, token)
        socket.username = username
        players.push(socket)
        socket.emit('loginSucceeded', {username, token})
        console.log(`${socket.username} logged in`)
      }
      if(players.indexOf(socket) != -1) return
      user.login(data).then(e => {
        if(e == true){
          socket.username = data.username
          players.push(socket)
          socket.emit('loginSucceeded', {username:socket.username, token:socket.token})
          console.log(`${socket.username} logged in`)
        }
        else socket.emit('loginFailed', e)
      })
    })

    socket.on('register', async (data) => {
      let rememberMe = data.rememberMe
      user.register(data).then(async e => {
        if(e == true){
          //create new login token in DB
          //probably not here
          //log it automaticly in and redirect to game
          let returnData = {}
          if(rememberMe) await getLoginTokenByUsername(data.username).then(t => {returnData.token = t})
          socket.username = data.username
          returnData.username = socket.username
          players.push(socket)
          socket.emit('registerSucceeded', returnData)
          console.log(`${socket.username} registered`)
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