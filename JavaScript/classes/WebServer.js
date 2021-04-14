require('dotenv').config()
const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000
const qs = require('querystring')

module.exports.WebServer = class{
    #publicPath = path.join(__dirname, '../public')
    #gets = [{url:'/404'}]
    #posts = []
    #requestListener = (req, res) => {}

    constructor(){ 
        this.init()
    }

    init(){
        this.#requestListener = (req, res) => {
            //res.setHeader("Access-Control-Allow-Origin", "*")
            if(req.url.includes('.html') || !req.url.includes('.')){
                let url = req.url.substring(0, req.url.indexOf('?') > -1 ? req.url.indexOf('?') : req.url.length)
                let args = req.url.indexOf('?') > -1 ? req.url.substring(req.url.indexOf('?') + 1, req.url.length).split("&") : []
                let tArgs = []
                args.map(a => {
                    a = decodeURI(a).split('=')
                    tArgs[a[0]] = a[1]
                })
                args = tArgs
                let pathUrl = req.url.substring(1, req.url.indexOf('?') > -1 ? req.url.indexOf('?') : req.url.length)
                if(pathUrl === "") pathUrl = 'index.html'
                url = url.replace('.html', '')
                if(!pathUrl.includes('.html')) pathUrl = `${pathUrl}.html`
                if(req.method == "GET"){
                    let get = this.#gets.find(r => r.url === url)
                    if(typeof get === "undefined") {
                        let tGet = this.#gets.filter(r => url.includes(r.url) && url.length - r.url.length == 1)
                        if(tGet.length > 0) get = tGet[0]
                        else get = this.#gets.filter(r => url.includes(r.url) && r.url != '')[0]
                    }
                    if(get){
                        let urlValue = url.replace(get.url, '').replace(/\//g, '')
                        req.data = {}
                        Object.keys(args).map(a => {
                            req.data[a] = args[a]
                        })
                        req.params = {}
                        if(get.varname) req.params[get.varname] = urlValue
                        let baseUrlPath = get.url
                        if(!baseUrlPath.includes('.html')) baseUrlPath = `${baseUrlPath}.html`
                        if(baseUrlPath.includes('/.html')) baseUrlPath = baseUrlPath.replace('/.html', '.html')
                        baseUrlPath = path.join(this.#publicPath, `pages/${baseUrlPath}`)
                        let htmlPath = path.join(this.#publicPath, `pages/${pathUrl}`)
                        if(fs.existsSync(htmlPath) || fs.existsSync(baseUrlPath)){
                            fs.readFile(path.join(this.#publicPath, `pages/template.html`), 'UTF-8', (err, template) => {
                                fs.readFile(fs.existsSync(htmlPath) ? htmlPath : baseUrlPath, 'UTF-8', (err, html) => {
                                    res.writeHead(200, {"Content-Type": "text/html"})
                                    
                                    req.vars = []
                                    if(html.match(/{{\w*}}/g)){
                                        html.match(/{{\w*}}/g).map(v => {
                                            req.vars[v.replace(/[{}]/g, "")] = v
                                        })
                                    }
                                    req.html = html
                                    if(get.callback) get.callback(req, res)
                                    if(req.html.match(/{{\w*}}/g)){
                                        req.html.match(/{{\w*}}/g).map(v => {
                                            req.html = req.html.replace(v, req.vars[v.replace(/[{}]/g, "")] || v)
                                        })
                                    }
                                    if(req.html.match(/<\bscript.*<\/script>|<\blink.*<\/link>|<\bstyle.*<\/style>/g)){
                                        let headData = req.html.match(/<\bscript.*<\/script>|<\blink.*<\/link>|<\bstyle.*<\/style>/g)
                                        let lines = req.html.split('\r\n')
                                        headData.map(h => {
                                            lines.map(l => {
                                                lines[lines.indexOf(l)] = l.replace(h, '')
                                            })
                                        })
                                        req.html = lines.join('\r\n')
                                        req.html = req.html.replace(/<[\w\s\d]*><\/[\w\s\d]*>/g, '')
                                        template = template.replace('{{HEAD}}', headData.toString().replace(/>,</g , '>\r\n<'))
                                    }
                                    else template = template.replace('{{HEAD}}', '')
                                    res.end(template.replace('{{BODY}}', req.html))
                                })
                            })
                        }
                        else{
                            if(Object.keys(req.params).length === 0) {
                                this.#error(req, res)
                            }
                            else{
                                req.data = {}
                                Object.keys(args).map(a => {
                                    req.data[a] = args[a]
                                })
                                if(get.callback) get.callback(req, res)
                                res.writeHead(200, {"Content-Type": "application/json"})
                                res.end(JSON.stringify(req.params) + JSON.stringify(req.data))
                            }
                        }
                    } 
                    else{
                        this.#error(req, res)
                    }
                }
                else if(req.method == "POST"){
                    let post = this.#posts.find(p => p.url === url)
                    if(post){
                        let body = ''
                        req.on('data', (data) => {
                            body += data
                        })
    
                        req.on('end', () => {
                            res.writeHead(200, {"Content-Type": "application/json"})
                            req.data = qs.parse(body)
                            post.callback(req, res)
                            res.end(JSON.stringify(req.data))
                        })
                    }
                    else{
                        this.#error(req, res)
                    }
                }
                else{
                    this.#error(req, res)
                }
                // console.log(url)
                // console.log(args)
                // console.log(pathUrl)
            }
            if(req.method == "GET" && !req.url.includes('.html') && req.url.includes('.')){
                if(fs.existsSync(path.join(this.#publicPath, req.url))){
                    let fileStream = fs.createReadStream(path.join(this.#publicPath, req.url), "UTF-8")
                    if(req.url.match("\.css$")){
                        res.writeHead(200, {"Content-Type": "text/css"})
                    }
                    else if(req.url.match("\.js$")){
                        res.writeHead(200, {"Content-Type": "text/javascript"})
                    }
                    fileStream.pipe(res)
                }
                else{
                    this.#error(req, res)
                }
            }
        }
    }

    /**
     * 
     * @param {string} url The url the user has to navigate towards.
     * /test/:id: With req.params you can get the data of variable back.
     * /test?id=123&pizza=456: With req.data you can get the data of variables back.
     * With req.vars you can get all the settable vars inside the html page.
     * You can set html variables with {{VARNAME}}.
     * @param {function} callback Gets called when user navigates to url and returns request and response variables.
     * (req, res) => {} Name of req and res can be whatever you want.
     */
    get(url, callback){
        let tUrl = ''
        let splittedUrl = url.split(/\//g)
        splittedUrl.shift()
        let varname = ''
        splittedUrl.map(u => {
            if(u.match(/:(.*)/)) varname = u.match(/:(.*)/)[1]
            u = u.replace(/:.*/, '')
            tUrl += u.length > 0 ? `/${u}` : u
        })
        url = tUrl
        this.#gets.push({url, callback, varname})
        //maybe add support for multiple
    }

    /**
     * 
     * @param {string} url The url the user has to post towards.
     * With req.data you can get the data of variables back.
     * @param {function} callback Gets called when user posts to url and returns request and response variables.
     * (req, res) => {} Name of req and res can be whatever you want.
     */
    post(url, callback){
        this.#posts.push({url, callback})
        //maybe add support for multiple
    }

    run(){
        http.createServer(this.#requestListener).listen(port, () => {
            console.log(`Listening on http://localhost:${port}`)
        })
    }

    #error = (req, res) => {
        res.statusCode=302
        res.setHeader('Location', `/404`)
        res.end()
    }
}