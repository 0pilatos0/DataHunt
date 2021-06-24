require('dotenv').config()
//const { Proxy } = require("./Server/Classes/Proxy")
const { Server } = require("./Server/Classes/Server")

//const proxy = new Proxy(3000)
const server = new Server(3000)

let init = async () => {
  await server.start()
  //await proxy.start()
}

process.on('SIGINT', async () => {
  await server.stop()
  process.exit()
})

init()