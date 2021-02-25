const discord = require("discord.js")
const bot = new discord.Client()
let channel

bot.login(process.env.BOTTOKEN)

module.exports.start = () => {
    return new Promise((resolve, reject) => {
        bot.once('ready', () => {
            channel = bot.channels.cache.get('813702265243435058')
            resolve(true)
        })
    }).catch = (e) => {
        console.log(e);
    }
}

module.exports.sendMessage = (message) => {
    return new Promise(async (resolve, reject) => {
        await channel.send(message)
        return await resolve(true)
    }).catch = (e) => {
        console.log(e);
    }
    //✅ ❌
}
