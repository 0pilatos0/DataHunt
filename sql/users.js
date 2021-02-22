const connection = require('./connection.js')

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query("SELECT * FROM users", (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(result) : resolve(false)
        })
    })
}

module.exports.getByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(result[0]) : resolve(false)
        })
    })
}

module.exports.getIDByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT id FROM users WHERE username = '${username}'`, (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(result[0]) : resolve(false)
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
            return resolve(true)
        })
    })
}

module.exports.create = (data) => {
    return new Promise((resolve, reject) => {
        this.existsByUsername(data.username).then(exists => {
            if(exists){resolve("Username already exists"); return} 
            connection.sqlCon.query(`INSERT INTO users (${Object.keys(data)}) VALUES ('${Object.values(data).join("','")}')`, (err, result, fields) => {
                if(err) throw err
                // connection.sqlCon.query(`INSERT INTO stats (user_id, coins, skin, exp, level, health, attack_id, class_id, speed) VALUES ('${result.insertId}', '0', '0', '0', '0', '0', '0', '0', '0')`, (err, result) => {
                //     if(err) throw err
                //     console.log(result.insertId)
                // })
                return resolve(true)
            })
        })
    })
}

module.exports.deleteByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`DELETE FROM users WHERE username = '${username}'`, (err, result, fields) => {
            if(err) throw err
            return resolve(true)
        })
    })
}

module.exports.existsByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT id FROM users WHERE username = '${username}'`, (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(true) : resolve(false)
        })
    })
}

module.exports.getVerifiedByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT id FROM users WHERE username = '${username}' AND verified = '1'`, (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(true) : resolve(false)
        })
    })
}

module.exports.getEnabledByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT id FROM users WHERE username = '${username}' AND enabled = '1'`, (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(true) : resolve(false)
        })
    })
}

module.exports.getUsernameByLoginToken = (token) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT users.username FROM users INNER JOIN logintokens ON users.id = logintokens.user_id WHERE logintokens.token = '${token}'`, (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(result[0].username) : resolve(false)
        })
    })
}

module.exports.addLoginToken = (username, token) => {
    return new Promise((resolve, reject) => {
        this.getIDByUsername(username).then(e => {
            connection.sqlCon.query(`INSERT INTO logintokens (user_id, token) VALUES ('${e.id}', '${token}') `, (err, result, fields) => {
                if(err) throw err
                return resolve(true)
            })
        })
    })
}

module.exports.deleteLoginToken = (username, token) => {
    return new Promise((resolve, reject) => {
        this.getIDByUsername(username).then(e => {
            connection.sqlCon.query(`DELETE FROM logintokens WHERE user_id = '${e.id}' AND token = '${token}'`, (err, result, fields) => {
                if(err) throw err
                return resolve(true)
            })
        })
    })
}

module.exports.getLoginTokenByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.sqlCon.query(`SELECT logintokens.token FROM users INNER JOIN logintokens ON users.id = logintokens.user_id WHERE users.username = '${username}'`, (err, result, fields) => {
            if(err) throw err
            return result.length > 0 ? resolve(result[0].token) : resolve(false)
        })
    })
}