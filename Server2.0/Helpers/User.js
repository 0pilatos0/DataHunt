const { Event } = require("../Classes/Event")
const { Salter } = require("../Classes/Salter")

module.exports.User = class extends Event {
    #user
    #loginTokens = []
    constructor(username) {
        super()
        global.sql.query(`SELECT * FROM users WHERE users.username = '${username}'`).then(u => {this.#user = u; this.trigger('ready')})
        this.on('ready', () => {
            this.#fetchLoginTokens().then(d => {
                this.trigger('load')
            })
        })
    }

    get name(){
        return this.#user.name
    }

    get username(){
        return this.#user.username
    }

    get enabled(){
        return this.#user.enabled
    }

    get verified(){
        return this.#user.verified
    }

    get createdAt(){
        return new Date(this.#user.created_at)
    }

    get password(){
        return this.#user.password
    }

    get email(){
        return this.#user.email
    }
    
    get id(){
        return this.#user.id
    }

    #fetchLoginTokens = () => {
        return new Promise((resolve, reject) => {
            global.sql.query(`SELECT * FROM logintokens WHERE user_id = '${this.id}'`).then(loginToken => {
                this.#loginTokens = []
                if(loginToken.length > 0){
                    loginToken.map(t => {
                        this.#loginTokens.push(t.token)
                    })
                }
                else{
                    this.#loginTokens.push(loginToken.token)
                }
            })
            return resolve(true)
        })
        
    }

    get loginTokens(){
        return this.#loginTokens
    }

    get verificationToken(){
        return this.#user.verifytoken
    }

    async createLoginToken(token){
        await global.sql.query(`INSERT INTO logintokens (user_id, token) VALUES ('${this.id}', '${token}')`)
        await this.#fetchLoginTokens()
    }

    static async exists(username){
        return Boolean(await global.sql.query(`SELECT * FROM users WHERE username = '${username}'`))
    }

    static get(username){
        return global.sql.query(`SELECT * FROM users WHERE username = '${username}'`)
    }

    static verified(username){
        return global.sql.query(`SELECT * FROM users WHERE username = '${username}' AND verified = '1'`)
    }

    static enabled(username){
        return global.sql.query(`SELECT * FROM users WHERE username = '${username}' AND enabled = '1'`)
    }

    static async new(name, username, email, password){
        let data = {name, username, email, password, verifytoken:Salter.generateRandomToken()}
        await global.sql.query(`INSERT INTO users (${Object.keys(data)}) VALUES ('${Object.values(data).join("','")}')`)
        return new this(username)
    }
}