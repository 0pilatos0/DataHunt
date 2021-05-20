const { Event } = require("./Event")
const sql = require('mysql')
require('dotenv').config()

module.exports.SQL = class extends Event{
    #con

    constructor(){
        super()
        this.#con = sql.createConnection({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE
        })
        global.sql = this
    }

    get con(){
        return this.#con
    }

    connect(){
        this.#con.connect((err) => {
            if(err) throw err
            this.trigger('connected', null, true)
        })
    }

    disconnect(){
        this.#con.end()
    }

    query(query){
        return new Promise((resolve, reject) => {
            this.#con.query(query, (err, result, fields) => {
                if(err) throw err
                if(query.includes("UPDATE") || query.includes("DELETE") || query.includes("INSERT")) return resolve(true)
                if(result.length <= 0) return resolve(false)
                if(result.length == 1) return resolve(result[0])
                return resolve(result)
            })
        })
    }

    createSetString(data){
        let setString = ""
        Object.keys(data).map(k => {
            setString += `${k} = '${k}'${data.indexOf(k) != Object.keys(data).length - 1 ? "," : ""}`
        })
        return setString
    }
}