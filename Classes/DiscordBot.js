const discord = require("discord.js")

module.exports.DiscordBot = class {
    #bot = new discord.Client()
    #token

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
        this.#bot.login(this.#token)
        return new Promise((resolve, reject) => {
            this.#bot.once('ready', () => {
                console.log(`Bot ${this.#bot.user.username} is running`)
                resolve(true)
            })
        })
    }

    /**
     Send message to channel
     await it for synchronous 
    **/
    sendMessage(message){
        return new Promise(async (resolve, reject) => {
            await this.#bot.channels.cache.get('813702265243435058').send(message)
            return await resolve(true)
        })
    }
}