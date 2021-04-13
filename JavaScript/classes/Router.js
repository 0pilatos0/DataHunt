module.exports.Router = class{
    #route
    #server
    constructor(route, server) {
        this.#route = route
        this.#server = server
    }

    /**
     * 
     * @param {string} url The url the user has to navigate towards.
     * /test:id: With req.params you can get the data of variable back.
     * /test?id=123&pizza=456: With req.data you can get the data of variables back.
     * With req.vars you can get all the settable vars inside the html page.
     * You can set html variables with {{VARNAME}}.
     * @param {function} callback Gets called when user navigates to url and returns request and response variables.
     * (req, res) => {} Name of req and res can be whatever you want.
     */
    get(url, callback){
        this.#server.get(`${this.#route}${url}`, callback)
    }

    /**
     * 
     * @param {string} url The url the user has to post towards.
     * With req.data you can get the data of variables back.
     * @param {function} callback Gets called when user posts to url and returns request and response variables.
     * (req, res) => {} Name of req and res can be whatever you want.
     */
    post(url, callback){
        this.#server.post(`${this.#route}${url}`, callback)
    }
}