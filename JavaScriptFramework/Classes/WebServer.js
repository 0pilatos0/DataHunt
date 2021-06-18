const http = require('http')
const path = require('path')
const fs = require('fs')
const Request = require('./Request')
const qs = require('querystring')
require('dotenv').config()
const Response = require('./Response')
const Regex = require('./Regex')
const SQL = require('./SQL')
const extensionTable = {
    js:'/js',
    css:'/css',
    png:'/img',
    jpg:'/img',
    gif:'/gif',
    ico:'/ico'
}

module.exports = class WebServer{
    #gets = []
    #posts = []
    #sessions = []
    #http = http.createServer(async (req, res) => {
        let tReq = req
        let tRes = res
        req = new Request(req)
        res = new Response(res)
        if(!path.extname(req.url.pathname)){
            //Set's session cookie and gets session
            if(Object.keys(req.cookies).indexOf('JSSESSID') > -1){
                if(Object.keys(this.#sessions).indexOf(req.cookies['JSSESSID']) !== -1){
                    req.session = this.#sessions[req.cookies['JSSESSID']]
                }
                else{
                    this.#sessions[req.cookies['JSSESSID']] = {}
                    req.session = this.#sessions[req.cookies['JSSESSID']]
                }
            }
            else{
                let jsSessID = ''
                for (let i = 0; i < 10; i++) {
                    jsSessID += Math.random().toString(36).substring(7)
                }
                jsSessID = jsSessID.substring(0, 54)
                res.cookie('JSSESSID', jsSessID)
                this.#sessions[jsSessID] = {}
                req.session = this.#sessions[jsSessID]
            }
            //Handles HTML Files
            req.params = []
            if(req.method == "GET"){
                tRes.writeHead(200, {'Content-Type': 'text/html'})
                //Handles HTML Get requests
                let getCallback = this.#getMatchingCallback(this.#gets, req, res)
                if(getCallback){
                    global.templateCallback(req, res)
                    await getCallback(req, res)
                    this.#sessions[req.cookies['JSSESSID']] = req.session
                    res.end()
                }
                else res.error()
            }
            else if(req.method == "POST"){
                //Handles HTML Post requests
                let postCallback = this.#getMatchingCallback(this.#posts, req, res)
                let body = ''
                tReq.on('data', (data) => {
                    body += data
                })
                tReq.on('end', async () => {
                    req.data = qs.parse(body)
                    if(postCallback){
                        await postCallback(req, res)
                        res.end(JSON.stringify(req.data))
                    }
                    else res.error()
                })
            }
        }
        else if(req.method === "GET" && path.extname(req.url.pathname)){
            //Handles files such as js and css
            let extension = extensionTable[path.extname(req.url.pathname).substr(1, req.url.pathname.length)]
            let filePath = `${__dirname}/../public${extension}${req.url.pathname.substr(req.url.pathname.lastIndexOf('/'), req.url.pathname.length)}`
            if(fs.existsSync(filePath)) res.end(fs.readFileSync(filePath))
            else {
                console.info(`${extension}${req.url.pathname} doesn't exist`)
                res.end()
            }
        }
    })
    constructor() {
        new SQL()
        global.ws = this
        this.#http.listen(process.env.PORT, 'localhost', () => {
            console.log(`Listening on http://localhost:${process.env.PORT}`)
        })
    }

    get(route, callback){
        this.#gets[route] = callback
    }

    post(route, callback){
        this.#posts[route] = callback
    }

    #getMatchingCallback(callbacks, req, res){
        let callback = null
        if(callbacks[req.url.pathname]) callback = callbacks[req.url.pathname]
        else{
            Object.keys(callbacks).map(c => {
                let splittedUrl = req.url.pathname.substr(1, req.url.pathname.lastIndexOf('/') === req.url.pathname.length - 1 ? req.url.pathname.length - 2 : req.url.pathname.length).split(/\//gm)
                let index = -1 //Did it this way, just in case if there are duplicate entries
                let splittedCallbackUrl = c.substr(1, (c.lastIndexOf('/') == c.length - 1) ? c.length - 2 : c.length).split(/\//gm)
                if(splittedCallbackUrl.length == splittedUrl.length){
                    let matching = splittedCallbackUrl.every(u => {
                        index++
                        if(u.match(Regex.SplitDynamicVarURL)) {
                            u = splittedUrl[index]
                        }
                        return u == splittedUrl[index]
                    })
                    if(matching){
                        for (let u = 0; u < splittedCallbackUrl.length; u++) {
                            if(splittedCallbackUrl[u].match(Regex.SplitDynamicVarURL)) {
                                let varName = splittedCallbackUrl[u].replace(/:/gm, '')
                                req.params[varName] = splittedUrl[u]
                            }
                        }
                        if(callbacks[c]) callback = callbacks[c]
                        return
                    }
                }
            })
        }
        return callback
    }
}