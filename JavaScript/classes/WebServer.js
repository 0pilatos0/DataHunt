require('dotenv').config()
const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000
const qs = require('querystring')

module.exports.WebServer = class{

    _server
    _publicPath = path.join(__dirname, '../public')
    _gets = [{url:'/404'}]
    _posts = []
    _requestListener = (req, res) => {}

    constructor(){ 
        this.init()
    }

    init(){
        this._requestListener = (req, res) => {
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
                if(url === "/index") url = '/'
                if(!pathUrl.includes('.html')) pathUrl = `${pathUrl}.html`
                if(req.method == "GET"){
                    let get = this._gets.find(r => r.url === url)
                    if(typeof get === "undefined") {
                        get = this._gets.filter(r => url.includes(r.url))
                        let tGet = {url:''}
                        get.map(g => {
                            if(g.url.length > tGet.url.length) tGet = g
                        })
                        get = tGet
                    }
                    if(get){
                        let value = url.replace(get.url, '')
                        let baseUrlPath = get.url
                        if(!baseUrlPath.includes('.html')) baseUrlPath = `${baseUrlPath}.html`
                        if(baseUrlPath.includes('/.html')) baseUrlPath = baseUrlPath.replace('/.html', '.html')
                        baseUrlPath = path.join(this._publicPath, `pages/${baseUrlPath}`)
                        let htmlPath = path.join(this._publicPath, `pages/${pathUrl}`)
                        if(fs.existsSync(htmlPath) || fs.existsSync(baseUrlPath)){
                            fs.readFile(path.join(this._publicPath, `pages/template.html`), 'UTF-8', (err, template) => {
                                fs.readFile(fs.existsSync(htmlPath) ? htmlPath : baseUrlPath, 'UTF-8', (err, html) => {
                                    res.writeHead(200, {"Content-Type": "text/html"})
                                    req.data = args
                                    req.vars = []
                                    if(html.match(/{{\w*}}/g)){
                                        html.match(/{{\w*}}/g).map(v => {
                                            req.vars[v.replace(/[{}]/g, "")] = v
                                        })
                                    }
                                    req.html = html
                                    req.params = []
                                    if(get.varname) req.params[get.varname] = value
                                    if(get.callback) get.callback(req, res)
                                    if(req.html.match(/{{\w*}}/g)){
                                        req.html.match(/{{\w*}}/g).map(v => {
                                            req.html = req.html.replace(v, req.vars[v.replace(/[{}]/g, "")] || v)
                                        })
                                    }
                                    if(req.html.match(/<\bscript.*|<\blink.*|<\bstyle.*/g)){
                                        console.log("?")
                                        let headData = html.match(/<\bscript.*|<\blink.*|<\bstyle.*/g)
                                        headData.map(h => {
                                            let lines = req.html.split('\n')
                                            lines.splice(lines.indexOf(h) > -1 ? lines.indexOf(h) : lines.indexOf(`${h}\r`), 1)
                                            req.html = lines.join('\n')
                                        })
                                        let headDataString = headData.toString()
                                        template = template.replace('{{HEAD}}', headDataString.replace(/>,</g , '>\r<'))
                                    }
                                    res.end(template.replace('{{BODY}}', req.html))
                                })
                            })
                        }
                        else{
                            req.data = args
                            req.params = []
                            if(get.varname) req.params[get.varname] = value
                            get.callback(req, res)
                            res.end()
                        }
                    } 
                    else{
                        this.error(req, res)
                    }
                }
                else if(req.method == "POST"){
                    let post = this._posts.find(p => p.url === url)
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
                        this.error(req, res)
                    }
                }
                else{
                    this.error(req, res)
                }
                // console.log(url)
                // console.log(args)
                // console.log(pathUrl)
            }
            if(req.method == "GET" && !req.url.includes('.html') && req.url.includes('.')){
                if(fs.existsSync(path.join(this._publicPath, req.url))){
                    let fileStream = fs.createReadStream(path.join(this._publicPath, req.url), "UTF-8")
                    if(req.url.match("\.css$")){
                        res.writeHead(200, {"Content-Type": "text/css"})
                    }
                    else if(req.url.match("\.js$")){
                        res.writeHead(200, {"Content-Type": "text/javascript"})
                    }
                    fileStream.pipe(res)
                }
                else{
                    this.error(req, res)
                }
            }
        }
    }

    get(url, callback){
        let tUrl = ''
        let splittedUrl = url.split('/')
        splittedUrl.splice(0, 1)
        let varname = ''
        splittedUrl.map(u => {
            if(u.match(/:(.*)/)) varname = u.match(/:(.*)/)[1]
            u = u.replace(/:.*/, '')
            tUrl += `/${u}`
        })
        url = tUrl
        this._gets.push({url, callback, varname})
        console.log(this._gets[this._gets.length - 1])
        //maybe add support for multiple
    }

    post(url, callback){
        this._posts.push({url, callback})
        //maybe add support for multiple
    }

    run(){
        http.createServer(this._requestListener).listen(port, () => {
            console.log(`Listening on http://localhost:${port}`)
        })
    }

    error(req, res){
        res.statusCode=302
        res.setHeader('Location', `/404`)
        res.end()
    }
}