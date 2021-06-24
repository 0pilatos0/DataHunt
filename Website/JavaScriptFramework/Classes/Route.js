module.exports = class Route{
    #route

    constructor(route) {
        this.#route = route
    }

    get(url, callback){
        global.ws.get(`${this.#route}${url}`, callback)
    }

    post(url, callback){
        global.ws.post(`${this.#route}${url}`, callback)
    }
}