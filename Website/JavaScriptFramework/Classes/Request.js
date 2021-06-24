const path = require('path')

module.exports = class Request{
    #request
    session = {}
    params = {}
    constructor(request) {
        this.#request = request
    }

    get method(){
        return this.#request.method
    }

    get url(){
        let parsedUrl = new URL(`http://${process.env.HOST}:${process.env.PORT}${this.#request.url}`)
        if(parsedUrl.pathname === '/') parsedUrl.pathname = '/index'
        return {
            href: parsedUrl.href,
            origin: parsedUrl.origin,
            protocol: parsedUrl.protocol,
            host: parsedUrl.host,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            pathname: parsedUrl.pathname,
            search: parsedUrl.search,
            vars: Object.fromEntries(parsedUrl.searchParams)
        }
    }

    get cookies(){
        if(!this.#request.headers.cookie) return []
        let parsedCookies = []
        this.#request.headers.cookie.split(/;/gm).map((c) => {
            let splittedCookie = c.split('=', 2)
            parsedCookies[splittedCookie[0].trim()] = splittedCookie[1].trim()
        })
        return parsedCookies
    }
}