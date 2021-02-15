const sql = require('mysql')

const sqlCon = sql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
})

module.exports.connect = new Promise((resolve, reject) => {
  sqlCon.connect((err) => {
    if(err) throw err
    resolve("Connected to DB")
  })
})

module.exports.disconnect = () => {
  sqlCon.end()
  console.log("Disconnected from DB")
}

module.exports.users = new Promise((resolve, reject) => {
  sqlCon.query("SELECT * FROM users", (err, result, fields) => {
    if(err) throw err
    resolve(result)
  })
})