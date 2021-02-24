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

module.exports.Server = class {
    #http
    #io
    #port

    constructor(port){
        this.#http = new http.createServer()
        this.#io = io()
        this.#port = port
    }

    async start(){
        return new Promise((resolve, reject) => {
            if(cluster.isMaster){
                let amountOfWorkersStarted = 0
                console.log(`Master ${process.pid} is running`)
    
                setupMaster(this.#http, {
                    loadBalancingMethod: "least-connection",
                })
                this.#http.listen(this.#port, async () => {
                    console.log(`Listening on http://localhost:${this.#port}`)
                })
    
                for (let i = 0; i < numCPUs; i++) {
                    let worker = cluster.fork()
                    worker.on('message', (data) => {
                        if(data.msg == 'ready'){
                            amountOfWorkersStarted++
                            if(amountOfWorkersStarted == numCPUs) resolve(true)
                        } 
                    })
                }
                
                process.on('message', (data) => {
                    console.log(data)
                })

                cluster.on('exit', (worker) => {
                    console.log(`Worker ${worker.process.pid} died`)
                    cluster.fork()
                })
            }
            else if(cluster.isWorker){
                console.log(`Worker ${process.pid} started`)
                process.send({msg:'ready'})
    
                this.#http = http.createServer()
                this.#io.attach(this.#http, ioConfig)
                this.#io.adapter(redisAdapter(redisConfig))
                setupWorker(this.#io)
                
                this.#io.on('connection', async (socket) => {
                    console.log(socket.id)
                })
            }
        })
        
        // this.#http.listen(`${this.#port}`, async () => {
        //     this.#io.attach(this.#http, ioConfig)
        //     this.#io.adapter(redisAdapter(redisConfig))
        //     console.log(`Listening on http://localhost:${this.#port}`)
        // })

        // this.#io.on('connection', async (socket) => {
        //     console.log(socket.id)
        // })
    }

    get playerCount(){
        return this.#io.sockets.sockets.size
    }

    get rooms(){
        return new Promise(async (resolve, reject) => {
            let rooms = await this.#io.sockets.adapter.allRooms()
            return resolve(Array.from(rooms))
        })
    }

    get globalPlayerCount(){
        return new Promise(async (resolve, reject) => {
            let rooms = await this.#io.sockets.adapter.allRooms()
            let sockets = await this.#io.sockets.adapter.sockets(rooms)
            return resolve(sockets.size)
        })
    }

    playerCountByRoom(room){
        return new Promise(async (resolve, reject) => {
            let sockets = await this.#io.sockets.adapter.sockets(new Set([room]))
            return resolve(sockets.size)
        })
    }
}