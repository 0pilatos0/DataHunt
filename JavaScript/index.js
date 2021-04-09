require('dotenv').config()
const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000

const requestListener = (req, res) => {
    if(req.method == "GET"){
        if(req.url.includes('.html') || !req.url.includes('.')){
            let url = req.url.substring(1, req.url.indexOf('?') > -1 ? req.url.indexOf('?') : req.url.length)
            let args = req.url.substring(req.url.indexOf('?') > -1 ? req.url.indexOf('?') : req.url.length, req.url.length)
            let pathUrl = url
            if(pathUrl === "") pathUrl = 'index.html'
            if(!pathUrl.includes('.html')) pathUrl = `${pathUrl}.html`
            // console.log(url)
            // console.log(args)
            // console.log(pathUrl)
            let htmlPath = path.join(__dirname, 'public', `pages/${pathUrl}`)
            if(!fs.existsSync(htmlPath)) {
                res.statusCode=302
                res.setHeader('Location', `/404?page=${url}${args}`)
                res.end()
            }
            else{
                fs.readFile(htmlPath, "UTF-8", (err, html) => {
                    res.writeHead(200, {"Content-Type": "text/html"})
                    html = html.replace("{{PIZZA}}", `GWN DYNAMISCH :D`)
                    res.end(html)
                })
            }
        }
        else if(!req.url.includes('.ico')){
            let fileStream = fs.createReadStream(path.join(__dirname, 'public', req.url), "UTF-8")
            if(req.url.match("\.css$")){
                res.writeHead(200, {"Content-Type": "text/css"})
            }
            else if(req.url.match("\.js$")){
                res.writeHead(200, {"Content-Type": "text/javascript"})
            }
            fileStream.pipe(res)
        }
        else{
            let url = req.url.substring(1, req.url.indexOf('?') > -1 ? req.url.indexOf('?') : req.url.length)
            let args = req.url.substring(req.url.indexOf('?') > -1 ? req.url.indexOf('?') : req.url.length, req.url.length)
            res.statusCode=302
            res.setHeader('Location', `/404?page=${url}${args}`)
            res.end()
        }
    }
}

http.createServer(requestListener).listen(port, 'localhost', () => {
    console.log(`Listening on http://localhost:${port}`)
})