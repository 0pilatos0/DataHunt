const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS
    }
})
module.exports.Mailer = class {
    /**
     Able to send mails
    **/
    constructor(){
        
    }

    /**
     Send mail with mailOptions
     @param {Object} mailOptions requires to as string, subject as string and text as string
     await it for synchronous 
    **/
    static sendMail(mailOptions){
        return new Promise(async (resolve, reject) => {
            mailOptions.from = process.env.GMAILUSER
            let result = await transporter.sendMail(mailOptions)
            return resolve(true)
        })
    }
}