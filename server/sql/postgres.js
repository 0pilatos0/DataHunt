const {Client} = require('pg')

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

client.connect()

client.query("CREATE TABLE users ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "name VARCHAR(255)," +
    "username VARCHAR(255)," +
    "email VARCHAR(255)," + 
    "phone VARCHAR(255)," +
    "password VARCHAR(255)," +
    "enabled BOOLEAN NOT NULL DEFAULT 1" +
");")
.then(res => {
    console.log("Table succesfully created")
})
.catch(err => {
    throw err
})
.finally(() => {
    client.end()
})