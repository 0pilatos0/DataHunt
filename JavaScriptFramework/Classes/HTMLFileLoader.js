const fs = require('fs')
const path = require('path')
const Regex = require('./Regex')

module.exports = class HTMLFileLoader{
    #html
    vars = []
    constructor(htmlFilePath) {
        if(path.extname(htmlFilePath) === ".html"){
            if(fs.existsSync(htmlFilePath)){
                this.#html = fs.readFileSync(htmlFilePath).toString()
                if(this.#html.match(Regex.HTMLVar)){
                    this.#html.match(Regex.HTMLVar).map(v => {
                        this.vars[v.replace(Regex.HTMLReplace, '')] = ''
                    })
                }
            }
            else console.error(`${htmlFilePath} doesn't exist`)
        } 
        else console.error(`${htmlFilePath} file extension must be .html`)
    }

    get data(){
        Object.keys(this.vars).map(v => {
            this.#html = this.#html.replace(`{{${v}}}`, this.vars[v])
        })
        return this.#html
    }
}