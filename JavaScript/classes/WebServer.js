require('dotenv').config()
const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000
const qs = require('querystring')
const { SQL } = require('./SQL')
const { User } = require('../helpers/User')

module.exports.WebServer = class{
    #sql = new SQL()
    #publicPath = path.join(__dirname, '../public')
    #gets = [{url:'/404'}]
    #posts = []
    #sessions = []
    #requestListener = (req, res) => {}

    constructor(){
        this.init()
    }

    init(){
        this.#requestListener = async (req, res) => {
            res.writeHead(200, {"Access-Control-Allow-Origin": "*"})
            res.redirect = (url) => {
                res.writeHead(302, {'Location': url})
            }
            res.cookie = (name, data, expires = Date.now() + 30 * 24 * 3600) => {
                res.writeHead(200, {'Set-Cookie': `${name}=${data}; Expires=${expires}`})
            }
            res.clearCookie = (name) => {
                res.writeHead(200, {'Set-Cookie': `${name}=; Max-Age=0`})
            }
            res.destroySession = (id) => {
                this.#sessions.splice(this.#sessions.indexOf(this.#sessions.find(s => s.id === id)), 1)
            }
            res.cookies = () => {
                return req.headers.cookie?.split(/;\s?/g)
            }
            res.createSession = () => {
                let cookies = req.headers.cookie?.split(/;\s?/g)
                cookies?.map(c => {
                    cookies[cookies.indexOf(c)] = c.split('=', 2)
                    c = c.split('=', 2)
                    if(c[0] === 'JSSESSID'){
                        if(!this.#sessions.some(s => s.id === c[1])) {
                            res.clearCookie(c[0])
                        }
                    }
                })
                cookies = req.headers.cookie?.split(/;\s?/g)
                if(typeof cookies === "undefined" || cookies.every(c => !c.includes('JSSESSID')) || this.#sessions.length == 0 || !this.#sessions.find(s => s.id === cookies.find(c => c.includes('JSSESSID')).split('=', 2)[1])){
                    let jsSessID = ''
                    for (let i = 0; i < 10; i++) {
                        jsSessID += Math.random().toString(36).substring(7)
                    }
                    while (jsSessID.length > 54) {
                        jsSessID = jsSessID.substring(0, jsSessID.length-1)
                    }
                    res.cookie('JSSESSID', jsSessID)
                    cookies?.map(c => {
                        if(c.includes('JSSESSID')) cookies[cookies.indexOf(c)] = `JSSESSID=${jsSessID}`
                    })
                    if(typeof cookies !== "undefined" && !cookies.every(c => {
                        !c.includes('JSSESSID')
                    })) cookies.push(`JSSESSID=${jsSessID}`)
                    if(typeof cookies === "undefined") cookies = [`JSSESSID=${jsSessID}`]
                    this.#sessions.push({id:jsSessID})
                }
                req.session = this.#sessions.find(s => s.id === cookies.find(c => c.includes('JSSESSID')).split('=', 2)[1])
                return this.#sessions.find(s => s.id === cookies.find(c => c.includes('JSSESSID')).split('=', 2)[1])
            }
            let cookies = req.headers.cookie?.split(/;\s?/g)
            if(cookies){
                if(cookies.find(c => c.includes('JSSESSID')) && !this.#sessions.find(s => s.id === cookies.find(c => c.includes('JSSESSID')).split('=', 2)[1])) res.clearCookie('JSSESSID')
            }
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
                    let urls = url.substring(1, url.length).split('/')
                    let get
                    this.#gets.some(g => {
                        let gUrls = g.url.substring(1, g.url.length).split('/')
                        if(gUrls == urls){ get = g; return true}
                        else if(gUrls.length === urls.length){
                            let rightUrl = gUrls.every(u => {
                                if(u === '*') u = urls[gUrls.indexOf(u)]
                                return urls.indexOf(u) > -1
                            })
                            if(rightUrl === true){get = g; return true}
                        }
                    })
                    let baseUrlPath = ''
                    if(get){
                        let tUrl = get.url.substring(1, get.url.length).split('/')
                        while(tUrl.indexOf('*') > -1){
                            let index = tUrl.indexOf('*')
                            let varObject = Object.values(get.vars).find(v => {
                                if(v.index == index) return v
                            })
                            req.params[varObject.varname] = urls[index]
                            tUrl[index] = '^'
                        }
                        baseUrlPath = get.url
                        if(!baseUrlPath.includes('.html')) baseUrlPath = `${baseUrlPath}.html`
                        if(baseUrlPath.includes('/.html')) baseUrlPath = baseUrlPath.replace('/.html', '.html')
                        baseUrlPath = path.join(this.#publicPath, `pages/${baseUrlPath}`)
                    }
                    req.params = {}
                    req.data = {}
                    Object.keys(args).map(a => {
                        req.data[a] = args[a]
                    })
                    //#region session
                    if(cookies) req.session = this.#sessions.find(s => s.id === cookies.find(c => c.includes('JSSESSID'))?.split('=', 2)[1]) || {}
                    else req.session = {}
                    //#endregion session
                    let htmlPath = path.join(this.#publicPath, `pages/${pathUrl}`)
                    if(fs.existsSync(htmlPath) || fs.existsSync(baseUrlPath)){
                        fs.readFile(path.join(this.#publicPath, `pages/template.html`), 'UTF-8', async (err, template) => {
                            //#region template server side added data
                            let templateReplaceData = ''
                            if(req.session.user){
                                req.session.userinfo = await User.info(req.session.user)
                                let userinfo = req.session.userinfo
                                if(userinfo["role_id"]){
                                    templateReplaceData += '<li><a id="admin" href="/admin">Admin</a></li>'
                                    templateReplaceData += '<li><a id="creationPatchnotes" href="/creationPatchnotes">Patchnotes</a></li>'
                                }
                                templateReplaceData += '<li style="float:right"><a id="logout" href="/logout">Logout</a></li>'
                                templateReplaceData += '<li style="float:right"><a id="user" href="/user">User</a></li>'
                                templateReplaceData += '<li style="float:right"><a id="friends" href="/friends">Friends</a></li>'
                            }
                            else{
                                templateReplaceData += `
                                    <li style="float:right"><a id="register" href="/register">Registration</a></li>
                                    <li style="float:right"><a id="login" href="/login">Login</a></li>`
                            }
                            let alertReplaceData = ""
                            if(req.session.alert){
                                let alertData = req.session.alert;
                                alertReplaceData += '' +
                                    '<div class="alert ' + alertData["type"] + '">\n' +
                                   alertData["message"] +
                                    '</div>'
                                alertReplaceData += `<script>
                                    window.setTimeout(function() {
                                        $(".alert").fadeTo(500, 0).slideUp(500, function(){
                                            $(this).remove();
                                        });
                                    }, 4000);
                                </script>`
                                delete req.session.alert;
                            }
                            template = template.replace('{{ALERT}}' , alertReplaceData)
                            template = template.replace('{{DYNAMICHEADER}}' , templateReplaceData)
                            template = template.replace('{{CHATWINDOW}}', fs.readFileSync(`${path.join(__dirname, '../elements/chatWindow.html')}`))
                            //#endregion
                            fs.readFile(fs.existsSync(htmlPath) ? htmlPath : baseUrlPath, 'UTF-8', async (err, html) => {
                                req.vars = []
                                if(html.match(/{{\w*}}/g)){
                                    html.match(/{{\w*}}/g).map(v => {
                                        req.vars[v.replace(/[{}]/g, "")] = v
                                    })
                                }
                                if(typeof cookies === "undefined" || cookies.find(c => !c.includes('JSSESSID'))) {
                                    let data = req.session
                                    let session = res.createSession()
                                    req.session = Object.assign(req.session, data)
                                    this.#sessions[this.#sessions.indexOf(session)] = req.session
                                }
                                req.html = html
                                if(get?.callback) await get.callback(req, res)
                                if(req.html.match(/{{\w*}}/g)){
                                    req.html.match(/{{\w*}}/g).map(v => {
                                        req.html = req.html.replace(v, req.vars[v.replace(/[{}]/g, "")] || '') //So the var shows empty
                                    })
                                }
                                if(req.html.match(/<script\b[^>]*>[\s\S]*?<\/script>|<link\b[^>]*>[\s\S]*?<\/link>|<style\b[^>]*>[\s\S]*?<\/style>/gm)){
                                    let headData = req.html.match(/<script\b[^>]*>[\s\S]*?<\/script>|<link\b[^>]*>[\s\S]*?<\/link>|<style\b[^>]*>[\s\S]*?<\/style>/gm)
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
                                //res.writeHead(200, {"Content-Type": "text/html"})
                                res.end(template.replace('{{BODY}}', req.html))
                            })
                        })
                    }
                    else{
                        if(get?.callback) await get.callback(req, res)
                        if(typeof cookies === "undefined" || cookies.find(c => !c.includes('JSSESSID'))) {
                            let data = req.session
                            let session = res.createSession()
                            req.session = Object.assign(req.session, data)
                            this.#sessions[this.#sessions.indexOf(session)] = req.session
                        }
                        //if(Object.keys(req.params).length === 0) this.#error(req, res)
                        if(Object.keys(req.params).length > 0){
                            req.data = {}
                            Object.keys(args).map(a => {
                                req.data[a] = args[a]
                            })
                            //res.writeHead(200, {"Content-Type": "application/json"})
                            res.end(JSON.stringify(req.params))
                        }
                        else{
                            res.end()
                        }
                    }
                    // } 
                    // else this.#error(req, res)
                }
                else if(req.method == "POST"){
                    let post = this.#posts.find(p => p.url === url)
                    if(post){
                        let body = ''
                        req.on('data', (data) => {
                            body += data
                        })
                        req.on('end', async () => {
                            //res.writeHead(200, {"Content-Type": "application/json"})
                            req.data = qs.parse(body)
                            //#region session
                            req.session = this.#sessions.find(s => s.id === cookies.find(c => c.includes('JSSESSID')).split('=', 2)[1]) || {}
                            if(typeof cookies === "undefined" || cookies.find(c => !c.includes('JSSESSID'))) {
                                let data = req.session
                                let session = res.createSession()
                                req.session = Object.assign(req.session, data)
                                this.#sessions[this.#sessions.indexOf(session)] = req.session
                            }
                            //#endregion session
                            await post.callback(req, res)
                            res.end(JSON.stringify(req.data))
                        })
                    }
                    else this.#error(req, res)
                }
                else this.#error(req, res)
                // console.log(url)
                // console.log(args)
                // console.log(pathUrl)
            }
            if(req.method == "GET" && !req.url.includes('.html') && req.url.includes('.')){
                if(fs.existsSync(path.join(this.#publicPath, req.url))){
                    if(req.url.match("\.css$")){
                        res.writeHead(200, {"Content-Type": "text/css"})
                    }
                    else if(req.url.match("\.js$")){
                        res.writeHead(200, {"Content-Type": "text/javascript"})
                    }
                    else if(req.url.match("\.gif")){
                        res.writeHead(200, {"Content-Type": "image/gif"})
                    }
                    else if(req.url.match("\.jpg") || req.url.match("\.jpeg")){
                        res.writeHead(200, {"Content-Type": "image/jpeg"})
                    }
                    else if(req.url.match("\.png")){
                        res.writeHead(200, {"Content-Type": "image/png"})
                    }
                    else{
                        return
                    }
                    let fileStream = fs.createReadStream(path.join(this.#publicPath, req.url))
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
        let vars = []
        splittedUrl.map(u => {
            if(u.match(/:(.*)/)) vars.push({varname:u.match(/:(.*)/)[1], index:splittedUrl.indexOf(u)})
            u = u.replace(/:.*/, '*')
            tUrl += `/${u}`
        })
        url = tUrl
        this.#gets.push({url, callback, vars})
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
        this.#sql.connect()
        this.#sql.on('connected', () => {
            http.createServer(this.#requestListener).listen(port, () => {
                console.log(`Listening on http://localhost:${port}`)
            })
        })
    }

    #error = (req, res) => {
        res.redirect('/404')
        res.end()
    }
}