const HTMLFileLoader = require("../Classes/HTMLFileLoader")

module.exports = class AdView{
    constructor({title, body, confirm, session}){
        let modalPage = new HTMLFileLoader(`${__dirname}/../Elements/adView.html`)
        modalPage.vars.TITLE = title
        modalPage.vars.BODY = body
        modalPage.vars.CONFIRM = confirm
        session.modal = modalPage.data
    }
}