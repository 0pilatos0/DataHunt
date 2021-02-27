require('dotenv').config()
const { Proxy } = require("./Classes/Proxy")
const { Server } = require("./Classes/Server")

const proxy = new Proxy(3000)
const server = new Server(3001)

let init = async () => {
  await server.start()
  await proxy.start()
}

process.on('SIGINT', async () => {
  await server.stop()
  process.exit()
})

init()

// #region shit
// const http = require('http').createServer()
// const io = require('socket.io')()//(http, {
// //   cors: {
// //     origin: "*"
// //   }
// // })

// require('dotenv').config()
// const sql = require('./sql/connection.js')
// sql.connect().then(e => {
//   //console.log(e)
// })

// const user = require('./Handlers/user.js')
// const { generateRandomToken } = require('./Helpers/security.js')
// const { getUsernameByLoginToken, getLoginTokenByUsername, deleteLoginToken, addLoginToken } = require('./sql/users.js')
// const { start, sendMessage } = require('./Helpers/discord.js')
// const { Server } = require('./Classes/Server.js')
// const { Proxy } = require('./Classes/Proxy.js')
// const { SQL } = require('./Classes/SQL.js')
// const { DiscordBot } = require('./Classes/DiscordBot.js')
// require('./Helpers/discord.js')

// initEvents = () => {
//   io.attach(http, {
//     pingInterval: 1000,
//     pingTimeout: 500,
//     cors: {
//       origin: "*"
//     }
//   })

//   io.on('connection', async (socket) => {
//     console.log("\x1b[32m", `+${socket.id}`)
  
//     socket.on('login', async (data) => {
//       if(data.token){
//         if(!data.rememberMe) return socket.emit('logout')
//         let token = generateRandomToken()
//         let username = await getUsernameByLoginToken(data.token)
//         if(!username) return socket.emit('logout')
//         deleteLoginToken(username, data.token)
//         addLoginToken(username, token)
//         socket.username = username
//         players.push(socket)
//         socket.emit('loginSucceeded', {username, token})
//         console.log(`${socket.username} logged in`)
//         sendMessage(`✅ ${socket.username}`)
//       }
//       if(players.indexOf(socket) != -1) return
//       user.login(data).then(e => {
//         if(e == true){
//           socket.username = data.username
//           players.push(socket)
//           socket.emit('loginSucceeded', {username:socket.username, token:socket.token})
//           console.log(`${socket.username} logged in`)
//           sendMessage(`✅ ${socket.username}`)
//         }
//         else socket.emit('loginFailed', e)
//       })
//     })
  
//     socket.on('register', async (data) => {
//       let rememberMe = data.rememberMe
//       user.register(data).then(async e => {
//         if(e == true){
//           //create new login token in DB
//           //probably not here
//           //log it automaticly in and redirect to game
//           let returnData = {}
//           if(rememberMe) await getLoginTokenByUsername(data.username).then(t => {returnData.token = t})
//           socket.username = data.username
//           returnData.username = socket.username
//           players.push(socket)
//           socket.emit('registerSucceeded', returnData)
//           console.log(`${socket.username} registered`)
//           //user gotta verifiy first and when done verifying, reload page to play! :D
//           sendMessage(`✅ ${socket.username}`)
//         }
//         else socket.emit('registerFailed', e)
//       })
//     })
  
//     socket.on('logout', (data) => {
//       console.log(data)
//     })
    
//     socket.on('autosave', (data) => {
//       console.log(data)
//     })
  
//     socket.on('disconnect', () => {
//         console.log("\x1b[31m", `-${socket.id}`)
//         let index = players.indexOf(socket)
//         if(index > -1){
//           players.splice(players.indexOf(socket), 1)
//           console.log(`${socket.username} logged off`)
//           sendMessage(`❌ ${socket.username}`)
//         }
//     })
//   })
// }

// let players = []

// setInterval(() => {
//   sql.sqlCon.query("DELETE FROM logintokens WHERE creationdate < NOW() - INTERVAL 30 DAY", (err, result, fields) => {
//     if(err) throw err
//   })
// }, 1000 * 60 * 60 * 24)

// http.listen(`${process.env.PORT || 3000}`, async () => {
//   try{
//     if(!process.env.PORT){
//       await start()
//       await sendMessage(`✅ server online`)
//       initEvents()
//       console.log(`listening on http://localhost:3000`)
//     }
//     else
//       console.log(`listening on https://datahuntserver.herokuapp.com`)
//   }
//   catch(e){
//     await quit()
//     console.log(e)
//   }
// })

// quit = async () => {
//   await sendMessage(`❌ server offline`)
//   sql.disconnect()
//   http.close()
//   process.exit()
// }

// process.on('SIGINT', async () => {
//   await quit() 
// })
// #endregion