const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS
    }
})

module.exports.mailOptions = {
    from: process.env.GMAILUSER,
    to: '',
    subject: '',
    text: '',
}

module.exports.sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        mailOptions.from = process.env.GMAILUSER
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) throw err
            console.log(info)
            return resolve(true)
        })
    })
}