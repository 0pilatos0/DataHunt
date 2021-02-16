const sql = require('mysql')

module.exports.sqlCon = sql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
})

module.exports.connect = () => {
  return new Promise((resolve, reject) => {
    this.sqlCon.connect((err) => {
      if(err) throw err
      resolve(true)
    })
  })
}

module.exports.disconnect = () => {
  this.sqlCon.end()
  return true
}