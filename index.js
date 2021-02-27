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