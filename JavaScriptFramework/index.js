const WebServer = require("./Classes/WebServer");
const Home = require("./Routes/Home");
const fs = require('fs')
const path = require('path');
const User = require("./Routes/User");
const Patchnotes = require('./Routes/Patchnotes')
const Admin = require('./Routes/Admin');
const Friends = require("./Routes/Friends");
const ProfilePicture = require("./Models/ProfilePicture")

new WebServer()

new Home()
new User()
new Patchnotes()
new Admin()
new Friends()

//Handle setting the template data
global.templateCallback = async (req, res) => {
    global.alert = ''
    global.chatwindow = ''
    global.dynamicheader = ''
    if(req.session.userinfo){
        let userinfo = req.session.userinfo
        if(userinfo["role_id"]){
            global.dynamicheader += '<li><a id="admin" href="/admin">Admin</a></li>'
        }
        picture = await ProfilePicture.getPicture(req.session.userinfo.id)
        global.dynamicheader += `
            <li style="float:right;">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding: 3px;">
                    <img style="max-height: 46px;" src="${picture.image}" alt="Not found" onerror=this.src="public/img/profile-placeholder.png"> ${req.session.userinfo.username}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDarkDropdownMenuLink">
                    <li style="float:right" class="dropdown-item"><a id="user" href="/user">User</a></li>
                    <li style="float:right" class="dropdown-item"><a id="friends" href="/friends">Friends</a></li>
                    <li style="float:right" class="dropdown-item"><a id="logout" href="/logout">Logout</a></li>
                </ul>
            </li>`
    }
    else{
        global.dynamicheader += `<li style="float:right"><a id="register" href="/register">Registration</a></li>`
        global.dynamicheader += `<li style="float:right"><a id="login" href="/login">Login</a></li>`
    }
    if(req.session.alert){
        let alertData = req.session.alert
        global.alert += `<div class="alert ${alertData["type"]}">\n ${alertData["message"]} </div>`
        global.alert += `
        <script>
            window.setTimeout(function() {
                $(".alert").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove();
                });
            }, 5000);
        </script>`
        delete req.session.alert
    }
    global.chatwindow += fs.readFileSync(`${path.join(__dirname, './Elements/chatWindow.html')}`)
}