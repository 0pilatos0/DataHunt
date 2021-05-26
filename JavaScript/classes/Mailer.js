const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS
    }
})
module.exports.Mailer = class {
    constructor(){
        
    }

    static sendMail(mailOptions){
        return new Promise(async (resolve, reject) => {
            mailOptions.from = process.env.GMAILUSER
            let result = await transporter.sendMail(mailOptions)
            return resolve(true)
        })
    }
}