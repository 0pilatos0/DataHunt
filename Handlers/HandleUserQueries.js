module.exports.getAll = (sql) => { return new Promise(async (resolve, reject) => { return resolve(await sql.query("SELECT * FROM users")) }) }

module.exports.getByUsername = (sql, username) => { return new Promise(async (resolve, reject) => { return resolve(await sql.query(`SELECT * FROM users WHERE username = '${username}'`)) }) }

module.exports.getIDByUsername = (sql, username) => { return new Promise(async (resolve, reject) => { return resolve(await sql.query(`SELECT id FROM users WHERE username = '${username}'`)) }) }

module.exports.updateByUsername = (sql, username, data) => {
    sql.createSetString(data)
    return new Promise(async (resolve, reject) => { return resolve(await sql.query(`UPDATE users SET ${setString} WHERE username = '${username}'`)) }) 
}

module.exports.create = (sql, data) => {
    return new Promise(async (resolve, reject) => {
        this.existsByUsername(sql, data.username).then(async exists => {
            if(exists){return resolve("Username already exists")} 
            let createdUser = await sql.query(`INSERT INTO users (${Object.keys(data)}) VALUES ('${Object.values(data).join("','")}')`)
            if(createdUser) return resolve(true)
            else return resolve(createdUser)
            // sql.query(`INSERT INTO stats (user_id, coins, skin, exp, level, health, attack_id, class_id, speed) VALUES ('${result.insertId}', '0', '0', '0', '0', '0', '0', '0', '0')`, (err, result) => {
            //     if(err) throw err
            //     sqlsole.log(result.insertId)
            // })
        })
    })
}

module.exports.deleteByUsername = (sql, username) => { return new Promise(async (resolve, reject) => { return resolve(await sql.query(`DELETE FROM users WHERE username = '${username}'`)) }) }

module.exports.existsByUsername = (sql, username) => { return new Promise(async (resolve, reject) => { return resolve(await sql.query(`SELECT id FROM users WHERE username = '${username}'`)) }) }

module.exports.getVerifiedByUsername = (sql, username) => { return new Promise(async (resolve, reject) => { return resolve(await sql.query(`SELECT id FROM users WHERE username = '${username}' AND verified = '1'`)) }) }

module.exports.getEnabledByUsername = (sql, username) => { return new Promise(async (resolve, reject) => { return resolve(await sql.query(`SELECT id FROM users WHERE username = '${username}' AND enabled = '1'`)) }) }

module.exports.getUsernameByLoginToken = (sql, token) => {
    return new Promise(async (resolve, reject) => {
        let result = await sql.query(`SELECT users.username FROM users INNER JOIN logintokens ON users.id = logintokens.user_id WHERE logintokens.token = '${token}'`)
        return resolve(Object.keys(result).includes('username') ? result.username : false)
    })
}

module.exports.addLoginToken = (sql, username, token) => {
    return new Promise(async (resolve, reject) => {
        this.getIDByUsername(sql, username).then(async e => {
            return resolve(await sql.query(`INSERT INTO logintokens (user_id, token) VALUES ('${e.id}', '${token}')`))
        })
    })
}

module.exports.deleteLoginToken = (sql, username, token) => {
    return new Promise(async (resolve, reject) => {
        this.getIDByUsername(sql, username).then(async e => {
            return resolve(await sql.query(`DELETE FROM logintokens WHERE user_id = '${e.id}' AND token = '${token}'`))
        })
    })
}

module.exports.getLoginTokenByUsername = (sql, username) => {
    return new Promise(async (resolve, reject) => {
        let result = await sql.query(`SELECT logintokens.token FROM users INNER JOIN logintokens ON users.id = logintokens.user_id WHERE users.username = '${username}'`)
        return resolve(Object.keys(result).includes('token') ? result.token : false)
    })
}