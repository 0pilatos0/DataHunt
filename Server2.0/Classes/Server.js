const ioConfig = {
    pingInterval: 1000,
    pingTimeout: 500,
    cors: {
      origin: "*"
    }
}

const redisConfig = {
    host: process.env.REDISHOST,
    port: process.env.REDISPORT
}

const { Event } = require("./Event")
const http = require('http')
const io = require('socket.io')
const redisAdapter = require('socket.io-redis')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const { setupMaster, setupWorker } = require('@socket.io/sticky')
const { SQL } = require('./SQL')
const { DiscordAPI } = require("./DiscordAPI")
const { logout, disconnect, login, register } = require("../Handlers/UserHandler")
require('dotenv').config()

global.nameRegex = /^[a-z ,.'-]+$/i
global.usernameRegex = /\w{5,29}/i
global.emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
global.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

module.exports.Server = class extends Event{
    #http = new http.createServer()
    #io = io()
    #port = process.env.PORT || 3000
    #sql = new SQL()

    constructor(){
        super()
        if(cluster.isMaster){
            let amountOfWorkersStarted = 0

            this.#sql.connect()

            this.#sql.on('connected', () => {
                console.log(`Master ${process.pid} is running`)

                setupMaster(this.#http, {
                    loadBalancingMethod: "least-connection",
                })
    
                this.#http.listen(this.#port, async () => {
                    console.log(`Listening on http://localhost:${this.#port}`)
                })
    
                for (let i = 0; i < numCPUs; i++) {
                    const worker = cluster.fork()
                    worker.on('message', async (data) => {
                        if(data.msg == 'ready'){
                            amountOfWorkersStarted++
                            if(amountOfWorkersStarted == numCPUs) {
                                DiscordAPI.sendMessage(`✅ server online`)
                                this.trigger('ready', null, true)
                            }
                        } 
                    })
                    //worker.send({msg:'ready', data:{}})
                }
    
                process.on('message', (data) => {
                    console.log(data)
                })
    
                cluster.on('exit', (worker) => {
                    console.log(`Worker ${worker.process.pid} died`)
                })
            })
        }
        else if(cluster.isWorker){
            this.#sql.connect()
            this.#sql.on('connected', () => {
                this.#io.attach(this.#http, ioConfig)
                this.#io.adapter(redisAdapter(redisConfig))
                setupWorker(this.#io)
    
                console.log(`Worker ${process.pid} started`)
                process.on('message', (msg) => {
                    if(msg.msg == "ready"){
                        
                    }
                })
                process.send({msg:'ready'})
                
                let players = []
    
                this.#io.on('connection', (socket) => {
                    console.log("\x1b[32m", `+${socket.id}`)

                    socket.on('login', (data) => {login(socket, data)})

                    socket.on('register', (data) => {register(socket, data)})

                    socket.on('logout', (data) => {logout(socket, data, players)})

                    socket.on('disconnect', (data) => {disconnect(socket, data, players)})
                })
            })
        }
    }

    /**
     get player count on the server only
    **/
     get playerCount(){
        return this.#io.sockets.sockets.size
    }

    /**
     get all rooms from all servers
    **/
    get rooms(){
        return new Promise(async (resolve, reject) => {
            let rooms = await this.#io.sockets.adapter.allRooms()
            return resolve(Array.from(rooms))
        })
    }

    /**
     get player count from all the servers
    **/
    get globalPlayerCount(){
        return new Promise(async (resolve, reject) => {
            let rooms = await this.#io.sockets.adapter.allRooms()
            let sockets = await this.#io.sockets.adapter.sockets(rooms)
            return resolve(sockets.size)
        })
    }

    /**
     get player count based on room
     @param {String} room name of room
    **/
    playerCountByRoom(room){
        return new Promise(async (resolve, reject) => {
            let sockets = await this.#io.sockets.adapter.sockets(new Set([room]))
            return resolve(sockets.size)
        })
    }

    stop(){
        this.#sql.disconnect()
    }
}