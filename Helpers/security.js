const bcrypt = require('bcrypt')

module.exports.generateRandomToken = () => {
    return bcrypt.hashSync(Math.floor(Math.random() * 1000000).toString(), 12)
}

module.exports.hashPassword = (password) => {
    const hash = bcrypt.hashSync(password, 12)
    return hash
}

module.exports.verifyPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}
