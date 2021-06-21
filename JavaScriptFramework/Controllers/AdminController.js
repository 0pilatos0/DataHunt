const Controller = require("../Classes/Controller");
const User = require("../Models/User");
const Ban = require("../Models/Ban");
const Ad = require("../Models/Ad");
const Patchnote = require("../Models/Patchnote");
const Feedback = require("../Helpers/Feedback");
const Modal = require("../Helpers/Modal");

module.exports = class AdminController extends Controller {
  constructor() {
    super();
  }

  static async HandleAdmin(req, res) {
    if (!req.session.userinfo || !req.session.userinfo.role_id) {
      res.redirect("/");
      return;
    }
    let ad = await Ad.last();
    let showHTML = req.session.show || "";
    delete req.session.show;
    let adImgUrl = ad.image;
    let fillFormHTML = `
            <script>
                document.getElementById('adTitleForm1').value = "${ad.title}";
                document.getElementById('adUrlForm1').value = "${ad.redirectURL}";
                document.getElementById('hiddenFileUrl').value = "${ad.image}";
            </script>`;
    let modalHTML = req.session.modal || "";
    delete req.session.modal;
    let usersHMTL = "";
    let users = await User.select({
      select: ["users.*", "user_roles.role_id"],
      joins: [
        `INNER JOIN user_roles ON user_roles.user_id = ${User.tableName}.id`,
      ],
    });
    let bans = await Ban.all();
    users.map((u) => {
      usersHMTL += `
                <tr>
                <td>${u["id"]}</td>
                <td>${u["name"]}</td>
                <td>${u["username"]}</td>
                <td>${u["email"]}</td>
                <td>${u["enabled"]}</td>
                <td>${u["verified"]}</td>
                <td>${u["role_id"]}</td>
                <td>
            `;
      let ban = bans.find((b) => {
        return b.user_id === u.id;
      });
      if (ban) {
        let banUntilDate = new Date(`${ban.ban_until} UTC`);
        usersHMTL += `${banUntilDate.getUTCFullYear()} - ${
          banUntilDate.getUTCMonth() + 1
        } - ${banUntilDate.getUTCDate()}`;
      }
      usersHMTL += `
                </td>
                <td>`;
      if (req.session.userinfo.role_id > u.role_id) {
        if (ban) {
          usersHMTL += `
                        <form method="post" style="display: inline-block;">
                            <input type="hidden" value="${u["id"]}" name="unban">
                            <button class="btn btn-primary" type="submit">Unban</button>
                        </form>`;
        } else {
          usersHMTL += `
                        <form method="post" style="display: inline-block;">
                            <input type="hidden" value="${u["id"]}" name="ban">
                            <button class="btn btn-primary" type="submit">Ban</button>
                        </form>`;
        }
        usersHMTL += `
                    <form method="post" style="display: inline-block;">
                        <input type="hidden" value="${u["id"]}" name="delete">
                        <button class="btn btn-primary" type="submit">Delete</button>
                    </form>`;
      }
      usersHMTL += `
                </td>
                </tr>
            `;
    });
    res.render("admin", {
      USERS: usersHMTL,
      SHOW: showHTML,
      MODAL: modalHTML,
      FILLFORM: fillFormHTML,
      AdBaseUrl: adImgUrl,
      TITLE: req.session.patchnoteTitle || "",
      DATA:
        req.session.note !== "<p><br></p>" && req.session.note
          ? req.session.note
          : "",
    });
    delete req.session.patchnoteTitle;
    delete req.session.note;
  }

  static async HandleAdminPost(req, res) {
    if (req.data.ban) {
      let user = await User.find({
        where: {
          id: req.data.ban,
        },
      });
      new Modal({
        title: "Ban user",
        body: `
                    <p>Are you sure you want to ban user ${user.username}?</p>
                    <form id="banModal" method="post">
                        <input type="date" name="date">
                        <input type="hidden" name="banConfirm" value="${req.data.ban}">
                    </form>`,
        confirm: `<button class="btn btn-primary" onclick="banModal.submit()">Confirm</button>`,
        session: req.session,
      });
      res.redirect("/admin");
      return;
    }

    if (req.data.banConfirm) {
      let user = await User.find({
        where: {
          id: req.data.banConfirm,
        },
      });
      await Ban.create({
        user_id: req.data.banConfirm,
        ban_by: req.session.userinfo.id,
        ban_until: req.data.date,
      });
      await User.update({
        where: {
          id: req.data.banConfirm,
        },
        data: {
          enabled: 0,
        },
      });
      new Feedback({
        type: "info",
        message: `Successfully banned user ${user.username}`,
        session: req.session,
      });
      res.redirect("/admin");
      return;
    }

    if (req.data.unban) {
      let user = await User.find({
        where: {
          id: req.data.unban,
        },
      });
      new Modal({
        title: "Unban user",
        body: `<p>Are you sure you want to unban user ${user.username}?</p>`,
        confirm: `
                    <form method="post" style="display: inline-block;">
                        <input type="hidden" value="${req.data.unban}" name="unbanConfirm">
                        <button class="btn btn-primary" type="submit">Unban</button>
                    </form>`,
        session: req.session,
      });
      res.redirect("/admin");
      return;
    }

    if (req.data.unbanConfirm) {
      let user = await User.find({
        where: {
          id: req.data.unbanConfirm,
        },
      });
      await Ban.delete({
        where: {
          user_id: req.data.unbanConfirm,
        },
      });
      await User.update({
        where: {
          id: req.data.unbanConfirm,
        },
        data: {
          enabled: 1,
        },
      });
      new Feedback({
        type: "success",
        message: `Successfully unbanned user ${user.username}`,
        session: req.session,
      });
      res.redirect("/admin");
      return;
    }

    if (req.data.delete) {
      let user = await User.find({
        where: {
          id: req.data.delete,
        },
      });
      new Modal({
        title: `Delete user`,
        body: `<p>Are you sure you want to delete user ${user.username}?</p>`,
        confirm: `
                    <form method="post" style="display: inline-block;">
                        <input type="hidden" value="${req.data.delete}" name="deleteConfirm">
                        <button class="btn btn-primary" type="submit">Delete</button>
                    </form>`,
        session: req.session,
      });
      res.redirect("/admin");
      return;
    }

    if (req.data.deleteConfirm) {
      let user = await User.find({
        where: {
          id: req.data.deleteConfirm,
        },
      });
      await User.delete({
        id: req.data.deleteConfirm,
      });
      new Feedback({
        type: "info",
        message: `Successfully deleted user ${user.username}`,
        session: req.session,
      });
      res.redirect("/admin");
      return;
    }

    if (
      req.data.has("adTitleForm1") &&
      req.data.has("adUrlForm1") &&
      req.data.has("adFileForm1")
    ) {
      await Ad.update({
        data: {
          active: 0,
        },
      });
      await Ad.create({
        title: req.data.adTitleForm1,
        redirectURL: req.data.adUrlForm1,
        active: 1,
        image: req.data.adFileForm1,
      });
      req.session.show = `<script>show('admanager')</script>`;
      res.redirect("/admin");
      return;
    }

    if (req.data.has("editorTitle") && req.data.has("data")) {
      if (req.data.editorTitle !== "" && req.data.data !== "<p><br></p>") {
        await Patchnote.create({
          title: req.data.editorTitle,
          note: req.data.data,
        });
        new Feedback({
          type: "info",
          message: "Successfully created patchnote",
          session: req.session,
        });
        res.redirect("/patchnotes");
      } else if (req.data.editorTitle == "") {
        new Feedback({
          type: "danger",
          message: "Could not edit patchnote, because title was empty",
          session: req.session,
        });
        req.session.patchnoteTitle = req.data.editorTitle;
        req.session.note = req.data.data;
        req.session.show = `<script>show('patchnotes')</script>`;
        res.redirect("/admin");
        return;
      } else if ((req.data.data = "<p><br></p>")) {
        new Feedback({
          type: "danger",
          message: "Could not edit patchnote, because content was empty",
          session: req.session,
        });
        req.session.patchnoteTitle = req.data.editorTitle;
        req.session.note = req.data.data;
        req.session.show = `<script>show('patchnotes')</script>`;
        res.redirect("/admin");
        return;
      }
    }
  }
};
