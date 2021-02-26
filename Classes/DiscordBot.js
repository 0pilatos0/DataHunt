const discord = require("discord.js")

module.exports.DiscordBot = class {
    #bot = new discord.Client()
    #token

    /**
     Create a new Discord bot
    **/
    constructor(token) {
        this.#token = token
        this.#bot.login(this.#token)
    }

    /**
     Start the bot
     await it for synchronous 
    **/
    async start(){
        return new Promise((resolve, reject) => {
            this.#bot.once('ready', () => {
                console.log(this.#bot.user.username)
                resolve(true)
            })
        })
    }
}

