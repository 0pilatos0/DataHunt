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

const http = require('http')
const io = require('socket.io')
const redisAdapter = require('socket.io-redis')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const { setupMaster, setupWorker } = require('@socket.io/sticky')
const { DiscordBot } = require('./DiscordBot')
const { SQL } = require('./SQL')
const { login, register, disconnect, logout } = require('../Handlers/HandleUser')

module.exports.Server = class {
    #http
    #io
    #port
    #sql
    #bot

    /**
     Create new all threads taking server
    **/
    constructor(port){
        this.#http = new http.createServer()
        this.#io = io()
        this.#port = port
        this.#bot = new DiscordBot()
        this.#sql = new SQL()
    }

    /**
     Start the server
     await it for synchronous 
    **/
    async start(){
        return new Promise(async (resolve, reject) => {
            if(cluster.isMaster){
                let amountOfWorkersStarted = 0
                
                await this.#bot.start()
                await this.#sql.connect()

                setInterval(() => {
                    this.#sql.query("DELETE FROM logintokens WHERE creationdate < NOW() - INTERVAL 30 DAY")
                }, 1000 * 60 * 60 * 24)

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
                                await this.#bot.sendEmergencyMessage(`✅ server online`)
                                resolve(true)
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
            }
            else if(cluster.isWorker){
                this.#bot.start()
                await this.#sql.connect()
                this.#http = http.createServer()
                this.#io.attach(this.#http, ioConfig)
                this.#io.adapter(redisAdapter(redisConfig))
                setupWorker(this.#io)

                console.log(`Worker ${process.pid} started`)
                process.send({msg:'ready'})

                process.on('message', (msg) => {
                    if(msg.msg == "ready"){
                        
                    }
                })
                
                let players = []

                this.#io.on('connection', async (socket) => {
                    console.log("\x1b[32m", `+${socket.id}`)

                    socket.on('login', async (data) => { login(data, socket, players, this.#bot, this.#sql) })

                    socket.on('register', async (data) => { register(data, socket, players, this.#bot, this.#sql) })

                    socket.on('logout', async () => { logout(socket, players, this.#bot) })

                    socket.on('autosave', (data) => {

                    })

                    socket.on('disconnect', () => { disconnect(socket, players, this.#bot) })
                })
            }
        })
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

    async stop(){
        return new Promise(async (resolve, reject) => {
            if(cluster.isMaster) await this.#bot.sendEmergencyMessage(`❌ server offline`)
            await this.#sql.disconnect()
            return resolve(true)
        })
    }
}