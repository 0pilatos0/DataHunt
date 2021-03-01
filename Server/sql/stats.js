// module.exports.getAll = () => {
//     return new Promise((resolve, reject) => {
//         connection.sqlCon.query("SELECT * FROM stats", (err, result, fields) => {
//             if(err) throw err
//             resolve(result)
//         })
//     })
// }

// module.exports.getByUsername = (username) => {
//     return new Promise((resolve, reject) => {
//         connection.sqlCon.query(`SELECT * FROM users INNER JOIN stats ON users.id = stats.user_id WHERE users.username = '${username}'`, (err, result, fields) => {
//             return resolve(result)
//         })
//     })
// }

// module.exports.getIdByUsername = (username) => {
//     return new Promise((resolve, reject) => {
//         connection.sqlCon.query(`SELECT user_id FROM users INNER JOIN stats ON users.id = stats.user_id WHERE users.username = '${username}'`, (err, result, fields) => {
//             result[0] = result[0]["user_id"]
//             return resolve(result)
//         })
//     })
// }

// module.exports.updateByUsername = (username, data) => {
//     let setString = ""
//     for (let i = 0; i < Object.keys(data).length; i++) {
//         setString += `${Object.keys(data)[i]} = '${Object.values(data)[i]}'${i != Object.keys(data).length - 1 ? "," : ""}`
//     }
//     return this.getIdByUsername(username).then(id => {
//         return new Promise((resolve, reject) => {
//             connection.sqlCon.query(`UPDATE stats SET ${setString} WHERE user_id = ${id[0]}`, (err, result, fields) => {
//                 return resolve(true)
//             })
//         })
//     })
// }