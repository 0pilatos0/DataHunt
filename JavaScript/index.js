const { Router } = require("./classes/Router.js");
const { Salter } = require("./classes/Salter.js");
const { WebServer } = require("./classes/WebServer.js");
const { Functions } = require("./helpers/Functions.js");
const { User } = require("./helpers/User.js");
const { Mailer } = require("./classes/Mailer.js");
const fs = require("fs");
const { HTMLFileReader } = require("./classes/HTMLFileReader.js");
let server = new WebServer();

server.get("/", async (req, res) => {
  let patchnote = await User.getASingularePatchnote();
  let myDate = new Date(patchnote["date_created"]);
  req.vars.PATCHTITLE = `Patch: ${patchnote["title"]}`;
  req.vars.PATCHDATE = `${myDate.getDate()}/${
    myDate.getMonth() + 1
  }/${myDate.getFullYear()} - ${myDate.getHours()}:${myDate.getMinutes()}`;
});

server.get("/test", (req, res) => {
  req.session.alert = {
    type: "alert-success",
    message: "test alert",
  };
  res.redirect("/");
  return;
});

server.get('/ad', (req, res) => {
  let cookies = res.cookies()
  let tCookies = []
  cookies.map(c => {
    let splittedCookie = c.split('=', 2)
    tCookies[splittedCookie[0]] = splittedCookie[1]
  })
  cookies = tCookies
  if(cookies.sawAd && cookies.sawAd === "false"){
    res.cookie('sawAd', 'true')
  }
  else if(!cookies.sawAd){
    let reader = new HTMLFileReader("./elements/modal.html");
    reader.vars.TITLE = "AD of the week";
    reader.vars.BODY = `<img src="data:image/jpeg;base64,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"></img>`
    reader.vars.CONFIRM = ``
    req.session.modal = reader.finish();
    res.cookie('sawAd', 'true')
    setTimeout(() => {
      res.redirect('/ad')
    }, 100);
  }
  req.vars.AD = req.session.modal
  delete req.session.modal
})

server.get('/removeAd', (req, res) => {
  res.clearCookie('sawAd')
})

server.post('/ad', (req, res) => {

})

server.get("/creationPatchnotes", (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  if (!req.session.userinfo.role_id) {
    res.redirect("/");
    return;
  }
});

server.post("/admin", async (req, res) => {
  if (req.data.ban) {
    let reader = new HTMLFileReader("./elements/modal.html");
    reader.vars.TITLE = "Ban Modal";
    reader.vars.BODY = `
                        <form id="banModal" method="post">
                        <input type="date" name="date">
                        <input type="hidden" name="banConfirm" value="${req.data.ban}">
                        </form>`;
    reader.vars.CONFIRM = `<button class="btn btn-primary" onclick="banModal.submit()">Confirm</button>`;
    req.session.modal = reader.finish();
    res.redirect("/admin");
    return;
  }
  if (req.data.banConfirm) {
    User.ban(req.data.banConfirm, req.session.userinfo.id, req.data.date);
    req.session.alert = {
      type: "alert-info",
      message: `Successfully banned user with ID: ${req.data.banConfirm}`,
    };
    res.redirect("/admin");
    return;
  }

  if (req.data.delete) {
    let reader = new HTMLFileReader("./elements/modal.html");
    reader.vars.TITLE = "Delete Modal";
    reader.vars.BODY = `<p>Are you sure you want to delete the user with the ID: ${req.data.delete}?</p>`;
    reader.vars.CONFIRM = `
                        <form method="post" style="display: inline-block;">
                        <input type="hidden" value="${req.data.delete}" name="deleteConfirm">
                        <button class="btn btn-primary" type="submit">Delete</button>
                        </form>`;
    req.session.modal = reader.finish();
    res.redirect("/admin");
    return;
  }
  if (req.data.deleteConfirm) {
    await Functions.adminDelete(req.data.deleteConfirm);
    req.session.alert = {
      type: "alert-info",
      message: `Successfully deleted user with ID: ${req.data.deleteConfirm}`,
    };
    res.redirect("/admin");
    return;
  }

  if (req.data.editorTitle !== "" && req.data.data !== "<p><br></p>") {
    await User.makePatchnote(req.data.editorTitle, req.data.data);
    req.session.alert = {
      type: "alert-info",
      message: "Successfully created patchnote",
    };
    res.redirect("/patchnotes");
  } else {
    req.session.alert = {
      type: "alert-danger",
      message: "Could not create patchnote, because data was not sufficient",
    };
    res.redirect("/creationPatchnotes");
  }
});

server.get("/verification", async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  let verificationToken = decodeURIComponent(req.data.veri);
  let id;
  let data = await global.sql.query(
    `SELECT verifytoken, id, name FROM users WHERE verifytoken = '${verificationToken}'`
  );
  id = data.id;
  await global.sql.query(
    `UPDATE users SET verifytoken = '', verified = 1 WHERE id = ${id}`
  );
  req.vars.FEEDBACK = "<h2>Thank you for verifying!</h2>";
});

server.get("/character", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  let stats = await User.getStats(req.data.id);
  req.vars.STATS = `${stats.name}, ${stats.level}`;
  req.vars.KD = `Your K/D (Kills divided by Deaths): ${Functions.calculateKD(
    stats.kills,
    stats.deaths
  )} <br> Health: ${stats.health} <br> Level: ${stats.level}`;
});

server.get("/friends", async (req, res) => {
  req.vars.FEEDBACK = req.session.friendFeedback;
  delete req.session.friendFeedback;
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  let results = await User.getMutlipleFriendships(req.session.user);
  for (let i = 0; i < results.length; i++) {
    if (results[i].userA == req.session.user) {
      results[i].name = await User.getUsername(results[i]["userB"]);
    } else {
      results[i].name = await User.getUsername(results[i]["userA"]);
    }
  }
  req.vars.FRIENDS = "";
  if (results.length > 0) {
    results.map((r) => {
      req.vars.FRIENDS += `<div class=\"card text-secondary w-75 mt-4\" style=\"width: 18rem;\">
            <div class=\"card-body\">
            <h5 class=\"card-title\">${r["name"].username}</h5>`;
      if (r["friendship"] == 0 && r["userA"] == req.session.user) {
        req.vars.FRIENDS += `<p class=\"card-text\">User hasn't replied to your request yet.</p>`;
      } else if (r["friendship"] == 0 && r["userB"] == req.session.user) {
        req.vars.FRIENDS += Functions.createButtons(r["id"]);
      } else if (r["friendship"] == 1) {
        req.vars.FRIENDS += `<p class=\"card-text\">You are friends.</p>`;
      }
      req.vars.FRIENDS += `</div></div>`;
    });
  }
});

server.post("/friends", async (req, res) => {
  let user = await User.getUsername(req.session.user);
  if (req.data["AccUsername"]) {
    let username = Functions.changeInput(req.data["AccUsername"]);
    let usernameRegex = /\w{5,29}/i;
    if (!username.match(usernameRegex)) {
      req.session.friendFeedback = `<div class=\"alert alert-danger\" role=\"alert\">The username doesn't follow our rules</div>`;
      res.redirect("/friends");
    }
    let friendId = await User.getUserId(username);
    friendId = friendId.id;
    if (friendId) {
      let friendship = await User.getFriendship(req.session.user, friendId);
      if (friendship) {
        req.session.friendFeedback = `<div class=\"alert alert-danger\" role=\"alert\">You are already friends with this user</div>`;
        if (friendship["friendship"] == 0 && friendship["userA"] == friendId) {
          await User.updateFriendship(friendship["id"], 1);
          res.redirect("/friends");
        }
      } else if (friendId === false) {
        req.session.friendFeedback = `<div class=\"alert alert-danger\" role=\"alert\">User doesn't exist</div>`;
        res.redirect("/friends");
      } else {
        req.session.friendFeedback = `<div class=\"alert alert-success\" role=\"alert\">Adding you as a friend right now :)</div>`;
        await User.setFriendShip(req.session.user, friendId, 0);
        res.redirect("/friends");
      }
    } else if (req.data.btnradio === "AcceptRequest") {
      await User.updateFriendship(req.data.id, 1);
      let results = await User.getFriendship(null, null, req.data.id);
      let friend;
      if (results["userA"] == req.session.user) {
        friend = results["userB"];
      } else {
        friend = results["userA"];
      }
      await User.addToFeed(
        req.session.user,
        `${user} and ${User.getUsername(friend)} are now friends!`
      );
      await User.addToFeed(
        friend,
        `${User.getUsername(friend)} are now friends!`
      );
      res.redirect("/friends");
    } else if (req.data.btnradio === "DeclineRequest") {
      await User.deleteFriendship(req.data.id);
      res.redirect("/friends");
    } else {
      req.session.friendFeedback = `<div class=\"alert alert-danger\" role=\"alert\">User doesn't exist</div>`;
      res.redirect("/friends");
    }
  }
  res.redirect("/friends");
});

server.get("/user", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  let userinfo = req.session.userinfo;
  req.vars.USERNAME = userinfo["username"];
  req.vars.EMAIL = userinfo["email"];
  req.vars.DYNAMICDATA = "";
  req.vars.PROFILEPICTURE = ``;
  if(await User.getProfilePictureId(req.session.userinfo.id)){
    let picture = await User.getProfilePicture(req.session.userinfo.id);
    req.vars.PROFILEPICTURE += `
      <div class="user">
         <div class="card-header">
             <h3>Profile Picture</h3>
             <img id="profilePicture" src="${picture.image}">
         </div>
      </div>
`;
  }
  if (req.data.delete) {
    if (req.data.delete === "true") {
      req.vars.DYNAMICDATA = `
            <div id=\"delete-account-overlay\" onclick='removeOverlay()' class=\"overlay delete-element\">
            </div>
            <div class=\"delete-confirm delete-element\">
            <h3>Are you sure you want to delete your account?</h3>
            <button id=\"cancel\" onclick=\"removeOverlay()\" class=\"btn btn-cancel\">Cancel</button>
            <a href=\"?delete=confirm\" class=\"btn btn-confirm\">Confirm</a>
            </div>`;
    } else if (req.data.delete === "confirm") {
      await User.delete(req.session.user);
      res.redirect("/");
      return;
    }
  }
  req.vars.CHARACTER = Functions.showCharacters(
    await User.characters(req.session.user)
  );
  req.vars.FEED = "";
  let feed = await User.getFeed(userinfo["id"]);
  if (feed.length > 0) {
    feed.map((f) => {
      req.vars.FEED += `<div>
                <p style='font-size: 20px'>${f["message"]}</p>
                <p>${f["time"]}</p>
            </div>`;
    });
  } else if (feed.message) {
    req.vars.FEED = `<div>
                <p style='font-size: 20px'>${feed["message"]}</p>
                <p>${feed["time"]}</p>
            </div>`;
  } else {
    req.vars.FEED = "<i>Its quite empty here</i>";
  }
});

server.post("/user", async (req, res) => {
  if (!req.session.userinfo){
    res.redirect("/");
    return
  }

  if(req.data.picture) {
    if(!await User.getProfilePictureId(req.session.userinfo.id)){
      await User.setProfilePicture(req.data.picture, req.session.userinfo.id);
      req.session.alert = {
        type: "alert-info",
        message: "Successfully made your profile picture",
      };
      res.redirect("/user");
    }else{
      await User.updateProfilePicture(req.data.picture, req.session.userinfo.id);
      req.session.alert = {
        type: "alert-info",
        message: "Successfully updated your profile picture",
      };
      res.redirect("/user");
    }
  }
});

server.get("/logout", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  await global.sql.query(
    `DELETE FROM logintokens WHERE user_id = ${req.session.user}`
  );
  Object.keys(req.session).map((k) => {
    if (k != "id") delete req.session[k];
  });
  res.redirect("/");
  return;
});

server.get("/register", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  req.vars.FEEDBACK = req.session.registerFeedback;
  req.vars.NAME = req.session.name;
  req.vars.USERNAME = req.session.username;
  req.vars.EMAIL = req.session.email;
  delete req.session.name;
  delete req.session.username;
  delete req.session.email;
});

server.post("/register", async (req, res) => {
  let name = Functions.changeInput(req.data["AccName"]);
  let username = Functions.changeInput(req.data["AccUsername"]);
  let email = Functions.changeInput(req.data["AccEmail"]);
  let password = Salter.hashPassword(
    Functions.changeInput(req.data["AccPassword"])
  );
  let verificationToken = Salter.generateRandomToken();
  let nameRegex = /^[a-z ,.\'-]+$/i;
  let usernameRegex = /\w{5,29}/i;
  let emailRegex =
    /(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  let passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!name.match(nameRegex)) {
    req.session.username = username;
    req.session.name = name;
    req.session.email = email;
    req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">You are the type of person to have a red line under your name in word.</div>`;
    res.redirect("/register");
    return;
  }
  if (!username.match(usernameRegex)) {
    req.session.username = username;
    req.session.name = name;
    req.session.email = email;
    req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>`;
    res.redirect("/register");
    return;
  }
  if (!email.match(emailRegex)) {
    req.session.username = username;
    req.session.name = name;
    req.session.email = email;
    req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">This isn't a valid email adress!</div>`;
    res.redirect("/register");
    return;
  }
  if (!req.data["AccPassword"].match(passwordRegex)) {
    req.session.username = username;
    req.session.name = name;
    req.session.email = email;
    req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Your password should be 8 characters long, have one uppercase and lowercase letters and a number!</div>`;
    res.redirect("/register");
    return;
  }
  if (req.data["AccPassword"] !== req.data["AccPasswordCheck"]) {
    req.session.username = username;
    req.session.name = name;
    req.session.email = email;
    req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Passwords don't match!</div>`;
    res.redirect("/register");
    return;
  }
  let exists = await User.getUserId(username);
  if (exists) {
    req.session.username = username;
    req.session.name = name;
    req.session.email = email;
    req.session.registerFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Username already in use</div>`;
    res.redirect("/register");
    return;
  }
  await global.sql.query(
    `INSERT INTO users (name, username, email, password, verifytoken) VALUES ('${name}', '${username}', '${email}', '${password}', '${verificationToken}')`
  );
  let user = await User.get(username);
  await global.sql.query(
    `INSERT INTO logintokens (user_id, token) VALUES (${user.id}, '${verificationToken}')`
  );
  await global.sql.query(
    `INSERT INTO user_roles (user_id, role_id) VALUES (${user.id}, 0)`
  );
  await Mailer.sendMail({
    to: email,
    subject: "Verify email Datahunt",
    html: fs
      .readFileSync(`../Mail/htmltestmail.html`, {
        encoding: "utf8",
        flag: "r",
      })
      .replace("{TOKEN}", encodeURIComponent(verificationToken))
      .replace(
        "{{HOST}}",
        process.env.PORT
          ? `${process.env.HOST}:${process.env.PORT}`
          : `${process.env.HOST}:3000`
      ),
  });
  res.redirect("/");
});

server.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  req.vars.FEEDBACK = req.session.loginFeedback;
  req.vars.USERNAME = req.session.username;
  delete req.session.username;
  delete req.session.loginFeedback;
});

server.post("/login", async (req, res) => {
  let username = Functions.changeInput(req.data["AccUsername"]);
  let password = Functions.changeInput(req.data["AccPassword"]);
  let token = Salter.generateRandomToken();
  res.cookie("token", token);
  let usernameRegex = /\w{5,29}/i;
  let passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  req.session.loginFeedback = "";
  if (!username.match(usernameRegex)) {
    req.session.loginFeedback += `<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>`;
    req.session.username = username;
    res.redirect("/login");
    return;
  }
  if (!password.match(passwordRegex)) {
    req.session.loginFeedback += `<div class=\"alert alert-danger\" role=\"alert\">Password is incorrect!</div>`;
    req.session.username = username;
    res.redirect("/login");
    return;
  }
  let user = await global.sql.query(
    `SELECT * FROM users WHERE username = ('${username}') AND enabled = 1 and verified = 1`
  );
  user.password = user.password.replace("$2y", "$2b");
  if (Salter.verifyPassword(password, user.password)) {
    req.session.user = user.id;
    if (req.data["AccRemember"] === "on") {
      await global.sql.query(
        `INSERT INTO logintokens (user_id, token) VALUES (${
          user.id
        }, '${Salter.generateRandomToken()}')`
      );
      res.redirect("/");
    }
  } else {
    req.session.username = username;
    req.session.loginFeedback = `<div class=\"alert alert-danger\" role=\"alert\">Invalid credentials!</div>`;
  }
  res.redirect("/login");
});

server.get("/admin", async (req, res) => {
  if (!req.session.userinfo || !req.session.userinfo["role_id"]) {
    res.redirect("/");
    return;
  }

  // Hier word de BaseURL dingen opgehaald
  req.vars.AdBaseUrl = "";
  let adBase = await User.getAdBase();
  req.vars.AdBaseUrl = adBase["image"];

  req.vars["DYNAMICDATA"] = "";
  req.vars.MODAL = req.session.modal;
  delete req.session.modal;
  req.vars["USERS"] = "";
  let users = await User.getMultiple();
  let bans = await User.checkAllBan();
  users.map((user) => {
    req.vars["USERS"] += `
            <tr>
            <td>${user["id"]}</td>
            <td>${user["name"]}</td>
            <td>${user["username"]}</td>
            <td>${user["email"]}</td>
            <td>${user["enabled"]}</td>
            <td>${user["verified"]}</td>
            <td>${user["role_id"]}</td>
            <td>
            `;

    if (typeof bans.length !== "undefined") {
      let ban = bans.find((b) => {
        if (b.user_id === user.id) {
          return b;
        }
      });
      if (ban) {
        let date = new Date(`${ban.ban_until} UTC`);
        req.vars["USERS"] += `${
          date.getUTCFullYear() +
          "-" +
          (date.getUTCMonth() + 1) +
          "-" +
          date.getUTCDate()
        }`;
      }
    } else {
      if (bans.user_id === user.id) {
        let date = new Date(bans.ban_until);
        req.vars["USERS"] += `${
          date.getUTCFullYear() +
          "-" +
          (date.getUTCMonth() + 1) +
          "-" +
          date.getUTCDate()
        }`;
      }
    }
    req.vars["USERS"] += `
            </td>
            <td>
            `;
    if (req.session.userinfo.role_id > user.role_id) {
      req.vars["USERS"] += `
                <form method="post" style="display: inline-block;">
                <input type="hidden" value="${user["id"]}" name="ban">
                <button class="btn btn-primary" type="submit">Ban</button>
                </form>
                <form method="post" style="display: inline-block;">
                <input type="hidden" value="${user["id"]}" name="delete">
                <button class="btn btn-primary" type="submit">Delete</button>
                </form>`;
    }
    `
            </td>
            </tr>
        `;
  });
});

server.get("/patchnotes", async (req, res) => {
  let patchnotes = await User.getPatchnotes();
  req.vars.PATCHNOTES = "";
  req.vars.MODAL = req.session.modal;
  delete req.session.modal;
  if (patchnotes.length > 1) {
    let myDate = new Date(patchnotes[0]["date_created"]);
    req.vars.LATESTPATCH = `
        <h1 style="display: inline;">${
          patchnotes[0]["title"]
        } - ${myDate.getHours()}:${myDate.getMinutes()}</h1>`;
    if (req.session.userinfo && req.session.userinfo["role_id"]) {
      req.vars.LATESTPATCH += `
            <div class="patchnotesButtons" id="${patchnotes[0]["id"]}">
                <i style="color: #50b64e" class="far fa-edit"></i>
                <i style="color: #fe0026;" class="fas fa-trash"></i>
            </div>`;
    }
    req.vars.LATESTPATCH += `${patchnotes[0]["note"]}`;

    for (let i = 1; i < patchnotes.length; i++) {
      let myDate = new Date(patchnotes[i]["date_created"]);
      req.vars.PATCHNOTES += `
            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${i}" aria-expanded="false" aria-controls="collapseExample${i}"  style="display: inline;">${myDate.getDate()}/${
        myDate.getMonth() + 1
      }/${myDate.getFullYear()} - ${myDate.getHours()}:${myDate.getMinutes()}</button>`;
      if (req.session.userinfo && req.session.userinfo["role_id"]) {
        req.vars.PATCHNOTES += `
            <div class="patchnotesButtons" id="${patchnotes[i]["id"]}">
                <i style="color: #50b64e" class="far fa-edit"></i>
                <i style="color: #fe0026;" class="fas fa-trash"></i>
            </div>`;
      }
      req.vars.PATCHNOTES += `<br>
            <div class="collapse" id="collapseExample${i}">
                <h1>${patchnotes[i]["title"]}</h1>
                ${patchnotes[i]["note"]}
            </div>
            `;
    }
  } else {
    if (patchnotes.id) {
      let myDate = new Date(patchnotes["date_created"]);
      req.vars.LATESTPATCH = `
            <h1 style="display: inline;">${
              patchnotes["title"]
            } - ${myDate.getHours()}:${myDate.getMinutes()}</h1>`;
      if (req.session.userinfo && req.session.userinfo["role_id"]) {
        req.vars.LATESTPATCH += `
                <div class="patchnotesButtons" id="${patchnotes["id"]}">
                    <i style="color: #50b64e" class="far fa-edit"></i>
                    <i style="color: #fe0026;" class="fas fa-trash"></i>
                </div>`;
      }
      req.vars.LATESTPATCH += `<br>${patchnotes["note"]}`;
    } else {
      req.vars.LATESTPATCH = ``;
    }
  }
});

server.post("/patchnotes", async (req, res) => {
  if (req.data.edit) {
    req.session.patchnoteId = req.data.edit;
    res.redirect("/editPatchnote");
  }
  if (req.data.delete) {
    let reader = new HTMLFileReader("./elements/modal.html");
    reader.vars.TITLE = "Delete Patchnote";
    reader.vars.BODY = `<p>Are you sure you want to delete patchnote with the ID: ${req.data.delete}?</p>`;
    reader.vars.CONFIRM = `
                        <form method="post" style="display: inline-block;">
                        <input type="hidden" value="${req.data.delete}" name="deleteConfirm">
                        <button class="btn btn-primary" type="submit">Delete</button>
                        </form>`;
    req.session.modal = reader.finish();
    res.redirect("/patchnotes");
    return;
  }
  if (req.data.deleteConfirm) {
    await User.deletePatchnote(req.data.deleteConfirm);
    req.session.alert = {
      type: "alert-success",
      message: `Deleted patch: ${req.data.deleteConfirm}`,
    };
    res.redirect("/patchnotes");
    return;
  }
});

server.get("/editPatchnote", async (req, res) => {
  let patchnoteData = await User.getASingularePatchnote(
    req.session.patchnoteId
  );
  req.vars.TITLE = patchnoteData.title;
  req.vars.DATA = patchnoteData.note.toString();
});

server.post("/editPatchnote", async (req, res) => {
  if (req.data.editorTitle !== "" && req.data.data !== "<p><br></p>") {
    await User.updatePatchnote(
      req.session.patchnoteId,
      req.data.editorTitle,
      req.data.data
    );
    req.session.alert = {
      type: "alert-info",
      message: "Successfully changed patchnote",
    };
    delete req.session.patchnoteId;
    res.redirect("/patchnotes");
  } else {
    req.session.alert = {
      type: "alert-danger",
      message: "Could not edit patchnote, because data was not sufficient",
    };
    delete req.session.patchnoteId;
    res.redirect("/patchnotes");
  }
});

server.run();
