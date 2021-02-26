const nodemailer = require('nodemailer')


module.exports.Mailer = class {
    #transporter

    /**
     Able to send mails
    **/
    constructor(){
        this.#transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAILUSER,
                pass: process.env.GMAILPASS
            }
        })
    }

    /**
     Send mail with mailOptions
     @param {Object} mailOptions requires to as string, subject as string and text as string
     await it for synchronous 
    **/
    sendMail(mailOptions){
        return new Promise((resolve, reject) => {
            mailOptions.from = process.env.GMAILUSER
            transporter.sendMail(mailOptions, (err, info) => {
                if(err) throw err
                return resolve(true)
            })
        })
    }
}