const connection = require('./connection.js')

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query("SELECT * FROM users", (err, result, fields) => {
            if(err) throw err
            resolve(result)
        })
    })
}

module.exports.getByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result, fields) => {
            if(err) throw err
            resolve(result)
        })
    })
}

module.exports.updateByUsername = (username, data) => {
    let setString = ""
    for (let i = 0; i < Object.keys(data).length; i++) {
        setString += `${Object.keys(data)[i]} = '${Object.values(data)[i]}'${i != Object.keys(data).length - 1 ? "," : ""}`
    }
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`UPDATE users SET ${setString} WHERE username = '${username}'`, data, (err, result, fields) => {
            if(err) throw err
            resolve(true)
        })
    })
}

module.exports.create = (data) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`INSERT INTO users (${Object.keys(data)}) VALUES ('${Object.values(data).join("','")}')`, (err, result, fields) => {
            if(err) throw err
            // connection.sqlCon.query(`INSERT INTO stats (user_id, coins, skin, exp, level, health, attack_id, class_id, speed) VALUES ('${result.insertId}', '0', '0', '0', '0', '0', '0', '0', '0')`, (err, result) => {
            //     if(err) throw err
            //     console.log(result.insertId)
            // })
            resolve(true)
        })
    })
}

module.exports.deleteByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`DELETE FROM users WHERE username = '${username}'`, (err, result, fields) => {
            if(err) throw err
            resolve(true)
        })
    })
}