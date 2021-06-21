const HTMLFileLoader = require("../Classes/HTMLFileLoader");

module.exports = class AdView {
  constructor({ title, body, confirm, session }) {
    let adViewPage = new HTMLFileLoader(`${__dirname}/../Elements/adView.html`);
    adViewPage.vars.TITLE = title;
    adViewPage.vars.BODY = body;
    adViewPage.vars.CONFIRM = confirm;
    session.adView = adViewPage.data;
  }
};
