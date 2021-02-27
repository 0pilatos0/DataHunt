const discord = require("discord.js")

let channel

module.exports.DiscordBot = class {
    #bot = new discord.Client()
    #token
    #messages = []

    /**
     Create a new Discord bot
    **/
    constructor(token) {
        this.#token = token || process.env.BOTTOKEN
    }

    /**
     Start the bot
     await it for synchronous 
    **/
    start(){
        return new Promise((resolve, reject) => {
            this.#bot.once('ready', () => {
                //console.log(`Bot ${this.#bot.user.username} is running`)
                channel = this.#bot.channels.cache.get('813702265243435058')
                resolve(true)
                setInterval(() => {
                    if(this.#messages.length > 0){
                        let message = this.#messages.shift()
                        channel.send(message)
                    }
                }, 1000)
            })
            this.#bot.login(this.#token)
        })
    }

    /**
     Send message to channel
     await it for synchronous 
    **/
    sendMessage(message){
        this.#messages.push(message)
    }

    sendEmergencyMessage(message){
        return new Promise(async (resolve, reject) => {
            await channel.send(message)
            return resolve(true)
        })
    }
}