const fs = require('fs')
const HTMLFileLoader = require('./HTMLFileLoader')
const path = require('path')

module.exports = class Response{
    #response
    constructor(response) {
        this.#response = response
    }

    redirect(url){
        this.#response.writeHead(302, {
            Location: `http://${process.env.HOST}:${process.env.PORT}${url}`
        })
    }

    sendFile(path){
        if(fs.existsSync(path)) this.send(fs.readFileSync(path))
        else console.error(`${path} doesn't exist`)
    }

    send(data){
        this.#response.write(data)
    }

    render(pageName, vars = {}){
        let templatePage = new HTMLFileLoader(`${__dirname}/../public/views/template.html`)
        let htmlPage = new HTMLFileLoader(`${__dirname}/../public/views/${pageName}.html`)
        Object.keys(vars).map(v => {
            htmlPage.vars[v] = vars[v]
        })
        templatePage.vars.BODY = htmlPage.data
        templatePage.vars.ALERT = global.alert || ""
        templatePage.vars.CHATWINDOW = global.chatwindow || ""
        templatePage.vars.DYNAMICHEADER = global.dynamicheader || ""
        if(!path.extname(pageName)) this.send(templatePage.data)
        else console.error("Please don't provide an extension")
    }

    async cookie(name, value, maxAge =  30 * 24 * 3600){
        this.#response.writeHead(200, {
            'Set-Cookie': `${name}=${value}`,
            'Max-Age': maxAge
        })
    }

    deleteCookie(name){
        this.#response.writeHead(200, {
            'Set-Cookie': `${name}=; Max-Age=0`
        })
    }

    end(data){
        this.#response.end(data)
    }

    error(){
        this.render('404')
        this.end()
    }
}