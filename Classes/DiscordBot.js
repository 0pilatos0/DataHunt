const discord = require("discord.js")

module.exports.DiscordBot = class {
    #bot = new discord.Client()
    #token

    constructor(token) {
        this.#token = token
        this.#bot.login(this.#token)
    }

    async start(){
        return new Promise((resolve, reject) => {
            this.#bot.once('ready', () => {
                console.log(this.#bot.user.username)
                resolve(true)
            })
        })
    }
}

