const mysql = require('mysql')
const Regex = require('./Regex')
require('dotenv').config()

module.exports = class SQL{
    #con
    constructor() {
        this.#con = mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            database: process.env.DB
        })
        this.#con.connect((err) => {
            if(err) throw err
        })
        global.sql = this
    }

    get con(){
        return this.#con
    }

    static parseSetData(set){
        let tSet = []
        let values = []
        Object.entries(set).map(obj => {
            let [key, value] = obj
            tSet.push(`${key} = ?`)
            values.push(value)
        })
        set = tSet.join(', ')
        return {set, values}
    }

    static parseCreateData(data){
        let tCreate = []
        let values = []
        let valuesString = []
        Object.entries(data).map(obj => {
            let [key, value] = obj
            tCreate.push(`${key}`)
            values.push(value)
            valuesString.push('?')
        })
        data = tCreate.join(', ')
        valuesString = valuesString.join(', ')
        return {create: data, values, valuesString}
    }

    static parseWhereData(where){
        if(!where) return {where: null, values: []}
        let tWhere = []
        let values = []
        
        Object.entries(where).map(obj => {
            let [key, value] = obj
            value = value.toString()
            let operator = value.match(Regex.SQLOperator) ? value.match(Regex.SQLOperator)[0] : null
            if(!operator) operator = ['=']
            if(value == null || value == "null"){
                value = ["!=", "<>", "<=>"].includes(operator) ? "IS NOT NULL" : "IS NULL"
                operator = ''
            }
            if(operator) value = value.substr(operator.length - 1, value.length)
            if(value.match(/OR/gm)){
                let ors = value.split(/OR/gm)
                value = ors.shift()
                values.push(value)
                let orString = ''
                ors.map((or) => {
                    operator = or.match(/=/) ? or.match(/=/)[0] : null
                    or = or.split(operator, 2)
                    if(orString === ''){
                        orString += `OR ${or[0]} ${operator} ?`
                    }
                    else{
                        orString += `AND ${or[0]} ${operator} ?`
                    }
                    values.push(or[1])
                })
                tWhere.push(`${key} ${operator} ? ${orString}`)
            }
            else{
                values.push(value)
                tWhere.push(`${key} ${operator} ?`)
            }
        })
        where = tWhere.join(' AND ')
        return {where, values}
    }

    async query(query, values){
        return new Promise((resolve, reject) => {
            this.#con.query(query, values, (err, res) => {
                if(err) throw err
                return resolve(res)
            })
        })
    }

    disconnect(){
        this.#con.end()
    }
}