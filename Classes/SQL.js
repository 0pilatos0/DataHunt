const sql = require('mysql')
require('dotenv').config()

module.exports.SQL = class {
    #con

    /**
     SQL database connector
    **/
    constructor(){
        this.#con = sql.createConnection({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE
        })
    }

    get con(){
        return this.#con
    }

    /**
     Connect to database
     await it for synchronous 
    **/
    connect(){
        return new Promise((resolve, reject) => {
            this.#con.connect((err) => {
                if(err) throw err
                console.log(`Connected to database ${process.env.MYSQLDATABASE}`)
                return resolve(true)
            })
        })
    }

    /**
     Disconnect from database
    **/
    disconnect(){
        this.#con.end()
        return true
    }

    /**
     Execute a query to the database
     await it for synchronous
     returns only the item if it has 1 entry, false if it has nothing and the whole array if it has more than 1 entry
    **/
    query(query){
        return new Promise((resolve, reject) => {
            this.#con.query(query, (err, result, fields) => {
                if(err) throw err
                if(result.length <= 0) return resolve(false)
                if(result.length == 1) return resolve(result[0])
                return resolve(result)
            })
        })
    }
}