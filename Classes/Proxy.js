const http = require('http')
const httpProxy = require('http-proxy')

const addresses = [
    {
        host:'localhost',
        port:3001
    }
]

module.exports.Proxy = class{
    #port
    #proxyServers

    constructor(port){
        this.#port = port
        this.#proxyServers = addresses.map(function (target) {
            return new httpProxy.createProxyServer({
                target: target
            })
        })
    }

    start(){
        return new Promise((resolve, reject) => {
            http.createServer((req, res) => {
                let proxy = this.#proxyServers.shift()
                proxy.web(req, res)
                this.#proxyServers.push(proxy)
            }).listen(this.#port, () => {
                return resolve(true)
            })
        })
    }
}