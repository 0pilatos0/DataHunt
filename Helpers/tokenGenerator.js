const sha256 = require('sha256')

module.exports.generateRandomToken = () => {
    return sha256(Math.floor(Math.random() * 1000000).toString())
}