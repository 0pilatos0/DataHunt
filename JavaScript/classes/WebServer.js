require('dotenv').config()
const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000
const qs = require('querystring')

module.exports.WebServer = class{

    _server
    _publicPath = path.join(__dirname, '../public')
    _routes = [{url:'/404'}]
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
                let args = req.url.substring(req.url.indexOf('?') > -1 ? req.url.indexOf('?') + 1 : req.url.length, req.url.length).split("&")
                args.map(a => {
                    args.splice(args.indexOf(a), 1)
                    a = decodeURI(a).split('=')
                    args[a[0]] = a[1]
                })
                let pathUrl = req.url.substring(1, req.url.indexOf('?') > -1 ? req.url.indexOf('?') : req.url.length)
                if(pathUrl === "") pathUrl = 'index.html'
                url = url.replace('.html', '')
                if(url === "/index") url = '/'
                if(!pathUrl.includes('.html')) pathUrl = `${pathUrl}.html`
                if(req.method == "GET"){
                    let route = this._routes.find(r => r.url === url)
                    if(route){
                        let htmlPath = path.join(this._publicPath, `pages/${pathUrl}`)
                        if(fs.existsSync(htmlPath)){
                            fs.readFile(htmlPath, "UTF-8", (err, html) => {
                                res.writeHead(200, {"Content-Type": "text/html"})
                                req.data = args
                                req.vars = []
                                html.match(/{{\w*}}/g).map(v => {
                                    req.vars[v.replace(/[{}]/g, "")] = v
                                })
                                req.html = html
                                if(route.callback) route.callback(req, res)
                                html.match(/{{\w*}}/g).map(v => {
                                    req.html = req.html.replace(v, req.vars[v.replace(/[{}]/g, "")])
                                })
                                res.end(req.html)
                            })
                        }
                        else{
                            route.callback(req, res)
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
                //console.log(args)
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

    on(url, callback){
        this._routes.push({url, callback})
        //maybe add support for multiple
    }

    post(url, callback){
        this._posts.push({url, callback})
        //maybe add support for multiple
    }

    run(){
        http.createServer(this._requestListener).listen(port, 'localhost', () => {
            console.log(`Listening on http://localhost:${port}`)
        })
    }

    error(req, res){
        res.statusCode=302
        res.setHeader('Location', `/404`)
        res.end()
    }
}