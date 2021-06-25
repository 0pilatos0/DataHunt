const { DiscordAPI } = require('./Classes/DiscordAPI')
const { Server } = require('./Classes/Server')

require('dotenv').config()

let s = new Server()
s.on('ready', (data) => {
    
})

process.on('SIGINT', async () => {
    //DiscordAPI.sendMessage(`❌ server offline`)
    setTimeout(() => {
        s.stop()
        process.exit()
    }, 1000)
})