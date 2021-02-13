const discord = require("discord.js")
const bot = new discord.Client()
require('dotenv').config()
const fs = require('fs')
let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
console.log(data.emojis)
let emojis = data.emojis

//const sql = require('./sql/sql.js')
//sql.connect.then(e => console.log(e))

let currentPresentEmbedID = ""
let presentEmbed
let presentTimer
let presentSecondsPassed = 0
let presentPeople = []
let startHour = 9 - 1
let startMinute = 0
let startSecond = 0
const validDays = {1: "Maandag", 2: "Dinsdag", 3: "Woensdag", 4: "Donderdag"}
const maxSeconds = 1800

bot.once('ready', async () => {
    console.log("Ready to go! :D")
    bot.user.setPresence({
        status: "dnd",  // You can show online, idle... Do not disturb is dnd
        game: {
            name: `${process.env.PREFIX}help`,  // The message shown
            type: "PLAYING" // PLAYING, WATCHING, LISTENING, STREAMING,
        }
    });
    let d = new Date()
    if(validDays[d.getDay()]){
        setInterval(() => {
            d = new Date()
            if(d.getHours() == startHour && d.getMinutes() <= startMinute + maxSeconds / 60){
                presentSecondsPassed++
            }
            if(d.getHours() == startHour && d.getMinutes() == startMinute && d.getSeconds() == startSecond){
                currentPresentEmbedID = ""
                presentEmbed = null
                clearInterval(presentTimer)
                presentTimer = null
                presentSecondsPassed = 0
                presentPeople = []
                const channel = bot.channels.cache.get('809448369700601917')
                presentEmbed = new discord.MessageEmbed()
                .setTitle(`Presentie ${validDays[d.getDay()]}`)
                .setColor("0xff0000")
                .setDescription("Presente mensen:")
                .setFooter(`${presentSecondsPassed} / ${maxSeconds}`)
                .setTimestamp()
                channel.send(presentEmbed)
            }
        }, 1000);
        // setInterval(() => {
        //     presentSecondsPassed++
        // }, 1000);
        // const channel = bot.channels.cache.get('809448369700601917')
        //         presentEmbed = new discord.MessageEmbed()
        //         .setTitle(`Presentie ${validDays[d.getDay()]}`)
        //         .setColor("0xff0000")
        //         .setDescription("Presente mensen:")
        //         .setFooter(`${presentSecondsPassed} / ${maxSeconds}`)
        //         .setTimestamp()
        //         channel.send(presentEmbed)
    }
})

bot.on('messageDelete', async message => {
    if(message.id == currentPresentEmbedID){
        currentPresentEmbedID = ""
        presentEmbed = null
        clearInterval(presentTimer)
        presentTimer = null
        presentSecondsPassed = 0
        presentPeople = []
    }
})

function checkIfEmojisStillExists(){
    for (let i = 0; i < emojis.length; i++) {
        if(emojis[i].length > 2){
            if(!bot.emojis.cache.get(emojis[i])){
                emojis.splice(emojis.indexOf(emojis[i]), 1)
                fs.writeFileSync('data.json', JSON.stringify({emojis:data.emojis = emojis}))
            }
        }
    }
}

bot.on('message', async message => {
    if(message.author == bot.user){
        let d = new Date()
        if(currentPresentEmbedID == "" && message.embeds.length > 0 && message.embeds[0].title == `Presentie ${validDays[d.getDay()]}`){
            currentPresentEmbedID = message.id
            checkIfEmojisStillExists()
	        message.react(emojis[Math.floor(Math.random() * emojis.length)])
            presentTimer = setInterval(() => {
                if(presentEmbed == null) return
                d = new Date()
                presentEmbed
                .setFooter(`${(d.getMinutes() - startMinute) * 60 + d.getSeconds() - startSecond} / ${maxSeconds}`)
                message.channel.messages.fetch(currentPresentEmbedID).then(m => m.edit(presentEmbed))
            }, 5000)
            const filter = (reaction, user) => {
                if(!user.bot && presentPeople.indexOf(`<@${user.id}>`) == -1){
                    if(presentEmbed == null) return
                    presentPeople.push(`<@${user.id}>`)
                    presentEmbed
                    .addField(`\u200b`, `<@${user.id}>`)
                    message.channel.messages.fetch(currentPresentEmbedID).then(m => m.edit(presentEmbed))
                }
            }
            message.awaitReactions(filter, { max: 0, time: maxSeconds * 1000, errors: ['time'] })
            .then(collected => {
                
            })
            .catch(collected => {
                clearInterval(presentTimer)
                if(presentEmbed == null) return
                presentEmbed
                .setFooter(`${maxSeconds} / ${maxSeconds}`)
                message.channel.messages.fetch(currentPresentEmbedID).then(m => m.edit(presentEmbed))
            })
        }
    } 
    if(!message.content.startsWith(process.env.PREFIX)) return
    let command = message.content.substr(1, message.content.length).split(" ")[0]
    let args = message.content.substr(command.length + process.env.PREFIX.length, message.content.length).trimStart().split(" ")
    if(command == "help"){
        message.delete()
        const embed = new discord.MessageEmbed()
        .setTitle("Help")
        .setColor("0xff0000")
        .setDescription("All the available commands:")
        //.addField(`${process.env.PREFIX}rusers:`, "See how many users are registered")
        //.addField(`${process.env.PREFIX}clear (amount)`, "Removes amount of messages")
        .addField(`${process.env.PREFIX}addPresentEmoji (\\ + emoji)`, "Adds emoji to random present emojis")
        .addField(`${process.env.PREFIX}removePresentEmoji (\\ + emoji)`, "Removes emoji from present emojis")
        .addField(`${process.env.PREFIX}getPresentEmojis`, "Get all present emojis")
        message.channel.send(embed)
    }
    if(command.toLowerCase() == "addpresentemoji"){
        message.delete()
        args[0] = args[0].replace("\\", "")
        if(emojis.indexOf(args[0]) == -1){
            if(args[0].length > 2)
                if(!bot.emojis.cache.get(args[0]))
                    return
            emojis.push(args[0])
            fs.writeFileSync('data.json', JSON.stringify({emojis:data.emojis = emojis}))
            if(args[0].length > 2)
                message.channel.send(`Added ${bot.emojis.cache.get(args[0])}`)
            else
                message.channel.send(`Added \\${args[0]}`)
        }
    }
    if(command.toLowerCase() == "removepresentemoji"){
        message.delete()
        args[0] = args[0].replace("\\", "")
        if(emojis.indexOf(args[0]) != -1){
            emojis.splice(emojis.indexOf(args[0]), 1)
            fs.writeFileSync('data.json', JSON.stringify({emojis:data.emojis = emojis}))
            if(args[0].length > 2)
                message.channel.send(`Removed ${bot.emojis.cache.get(args[0])}`)
            else
                message.channel.send(`Removed \\${args[0]}`)
        }
    }
    if(command.toLowerCase() == "getpresentemojis"){
        message.delete()
        let tEmojis = []
        checkIfEmojisStillExists()
        for (let i = 0; i < emojis.length; i++) {
            if(emojis[i].length > 2){
                tEmojis.push(bot.emojis.cache.get(emojis[i]))
            }
            else
                tEmojis.push("\\" + emojis[i])
        }
        message.channel.send(tEmojis.join(','))
    }
    // if(command == "rusers"){
    //     message.delete()
    //     let users = await sql.users.then((e) => {return e})
    //     message.channel.send(`users registered: ${users.length}`)
    // }
    // if(command == "clear"){
    //     if(args[0] > 99) args[0] = 99
    //     message.channel.bulkDelete(parseInt(args[0]) + parseInt(1))
    // }
})

bot.login(process.env.BOTTOKEN)