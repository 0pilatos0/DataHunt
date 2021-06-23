const Controller = require("../Classes/Controller");
const Patchnote = require("../Models/Patchnote");
const User = require("../Models/User");
const InputParser = require("../Helpers/InputParser");
const Salter = require("../Helpers/Salter");
const Regex = require("../Classes/Regex");
const Logintoken = require("../Models/Logintoken");
const Role = require("../Models/Role");
const Mailer = require("../Helpers/Mailer");
const HTMLFileLoader = require("../Classes/HTMLFileLoader");
const Ad = require('../Models/Ad');
const AdView = require("../Helpers/AdView");

module.exports = class HomeController extends Controller {
  constructor() {
    super();
  }

  static async HandleHome(req, res) {
    let patchnote = await Patchnote.last({
      where: {
        deleted: 0,
      },
    });
    let ad = await Ad.last({
      where:{
        active: 1
      }
    })
    if(req.cookies.seenAd){
      let date = new Date(Date.now())
      if(date.getDay() == 0){
        res.deleteCookie('seenAd')
      }
    }
    else{
      new AdView({
        title: 'Ad of the week',
        body: `<img style="max-width: 100%" src="${ad.image}"></img>`,
        confirm: `<a class="btn btn-primary" href="${ad.redirectURL}">Read More</a>`,
        session: req.session
      })
      res.cookie('seenAd', true)
    }
    
    let parsedDate = new Date(patchnote.date_created);
    res.render("index", {
      PATCHTITLE: `Patch: ${patchnote.title}`,
      PATCHDATE: `${parsedDate.getDate()}/${
        parsedDate.getMonth() + 1
      }/${parsedDate.getFullYear()} - ${parsedDate.getHours()}:${parsedDate.getMinutes()}`,
      ADVIEW: req.session.adView || "",
    });
    delete req.session.adView;
  }

  static async HandleLogin(req, res) {
    if (req.session.userinfo) {
      res.redirect("/");
      return;
    }
    res.render("login", {
      FEEDBACK: req.session.loginFeedback || "",
      USERNAME: req.session.username || "",
    });
    delete req.session.loginFeedback;
    delete req.session.username;
  }

  static async HandleRegister(req, res) {
    if (req.session.userinfo) {
      res.redirect("/");
      return;
    }
    res.render("register", {
      FEEDBACK: req.session.registerFeedback || "",
      NAME: req.session.name || "",
      USERNAME: req.session.username || "",
      EMAIL: req.session.email || "",
    });
    delete req.session.name;
    delete req.session.username;
    delete req.session.email;
    delete req.session.registerFeedback;
  }

  static async HandlePostLogin(req, res) {
    if(req.session.userinfo){
      res.redirect('/')
      return
    }
    let username = InputParser.parse(req.data["AccUsername"]);
    let password = InputParser.parse(req.data["AccPassword"]);
    let token = Salter.generateRandomToken();
    if (!username.match(Regex.Username)) {
      req.session.loginFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>`;
      req.session.username = username;
      res.redirect("/login");
      return;
    }
    if (!password.match(Regex.Password)) {
      req.session.loginFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your password doesn't follow our rules!</div>`;
      req.session.username = username;
      res.redirect("/login");
      return;
    }
    let user = await User.find({
      select: ["users.*", "user_roles.role_id"],
      where: {
        username,
      },
      joins: [
        `INNER JOIN user_roles on ${User.tableName}.id = user_roles.user_id`,
      ],
    });
    if (user && user.enabled && user.verified) {
      if (Salter.verifyPassword(password, user.password)) {
        req.session.userinfo = user;
        if (req.data["AccRemember"] === "on") {
          await Logintoken.create({
            user_id: user.id,
            token,
          });
          res.cookie("token", token);
        }
        res.redirect("/");
        return;
      } else {
        req.session.username = username;
        req.session.loginFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Invalid credentials!</div>`;
        res.redirect("/login");
        return;
      }
    } else if (!user.enabled) {
      req.session.loginFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your account is disabled!</div>`;
      res.redirect("/login");
      return;
    } else if (!user.verified) {
      req.session.loginFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your account needs to be verified!</div>`;
      res.redirect("/login");
      return;
    }
  }

  static async HandlePostRegister(req, res) {
    if(req.session.userinfo){
      res.redirect('/')
      return
    }
    let name = InputParser.parse(req.data["AccName"]);
    let username = InputParser.parse(req.data["AccUsername"]);
    let email = InputParser.parse(req.data["AccEmail"]);
    let password = Salter.hashPassword(
      InputParser.parse(req.data["AccPassword"])
    );
    let verificationToken = Salter.generateRandomToken();
    let returnErrorMessage = (message) => {
      req.session.username = username;
      req.session.name = name;
      req.session.email = email;
      req.session.registerFeedback = message;
      res.redirect("/register");
    };
    if (!name.match(Regex.Name)) {
      returnErrorMessage(
        `<div class=\"alert alert-danger\" role=\"alert\">You are the type of person to have a red line under your name in word.</div>`
      );
      return;
    }
    if (!username.match(Regex.Username)) {
      returnErrorMessage(
        `<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>`
      );
      return;
    }
    if (!email.match(Regex.Email)) {
      returnErrorMessage(
        `<div class=\"alert alert-danger\" role=\"alert\">This isn't a valid email adress!</div>`
      );
      return;
    }
    if (!req.data["AccPassword"].match(Regex.password)) {
      returnErrorMessage(
        `<div class=\"alert alert-danger\" role=\"alert\">Your password should be 8 characters long, have one uppercase and lowercase letters and a number!</div>`
      );
      return;
    }
    if (req.data["AccPassword"] !== req.data["AccPasswordCheck"]) {
      returnErrorMessage(
        `<div class=\"alert alert-danger\" role=\"alert\">Passwords don't match!</div>`
      );
      return;
    }
    let id = await User.findId({
      where: { username },
    });
    if (id) {
      returnErrorMessage(
        `<div class=\"alert alert-danger\" role=\"alert\">Username already in use</div>`
      );
      return;
    }
    await User.create({
      name,
      username,
      email,
      password,
      verifytoken: verificationToken,
    });
    let user = await User.find({
      where: {
        username,
      },
    });
    await Role.create({
      user_id: user.id,
      role_id: 0,
    });
    let mailPage = new HTMLFileLoader(`${__dirname}/../Mail/htmltestmail.html`);
    mailPage.vars.HOST = `${process.env.HOST}${
      process.env.PORT ? `:${process.env.PORT}` : ""
    }`;
    mailPage.vars.TOKEN = verificationToken;
    await Mailer.sendMail({
      to: email,
      subject: "Verify email DataHunt",
      html: mailPage.data,
    });
    res.redirect("/");
  }

  static async HandleLogout(req, res) {
    if (!req.session.userinfo) {
      res.redirect("/");
      return;
    }
    await Logintoken.delete({
      where: {
        user_id: req.session.userinfo.id,
      },
    });
    Object.keys(req.session).map((k) => {
      delete req.session[k];
    });
    delete req.session.userinfo
    res.redirect("/");
    return;
  }

  static async HandleVerification(req, res) {
    if(!req.session.userinfo){
      res.redirect('/')
      return
    }
    if (req.session.userinfo) {
      res.redirect("/");
      return;
    }
    let verificationToken = decodeURIComponent(req.url.vars.veri);
    let userData = await User.find({
      where: {
        verifytoken: verificationToken,
      },
      select: ["verifytoken", "id", "name"],
    });
    if (userData) {
      await User.update({
        where: {
          id: userData.id,
        },
        data: {
          verifytoken: "",
          verified: 1,
        },
      });
      res.render("verification", {
        FEEDBACK: "<h2>Thank you for verifying!</h2>",
      });
    } else {
      res.redirect("/");
      return;
    }
  }
};
