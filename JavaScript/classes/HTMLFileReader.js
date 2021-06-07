const fs = require('fs')

module.exports.HTMLFileReader = class {
    #data
    vars
    constructor(path){
        this.#data = fs.readFileSync(path).toString()
        this.vars = this.#data.match(/{{\w*}}/gm)
        let tVars = []
        this.vars.map(v => {
            tVars[v.replace(/[{}]/g, '')] = v
        })
        this.vars = tVars
    }

    finish(){
        Object.keys(this.vars).map(v => {
            this.#data = this.#data.replace(`{{${v}}}`, this.vars[v])
        })
        return this.#data
    }
}