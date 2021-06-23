const Controller = require("../Classes/Controller")
const CharacterParser = require("../Helpers/CharacterParser")
const ProfilePicture = require('../Models/ProfilePicture')
const User = require('../Models/User')
const Feed = require('../Models/Feed')
const Character = require('../Models/Character')
const Feedback = require("../Helpers/Feedback")
const Modal = require("../Helpers/Modal")

module.exports = class UserController extends Controller{
    constructor(){
        super()
    }

    static async HandleUser(req, res){
        if(!req.session.userinfo){
            res.redirect('/')
            return
        }
        let profilePicture = ''
        let userinfo = req.session.userinfo
        if(await ProfilePicture.findId({
            where: {
                user_id: userinfo.id
            }
        })){
            let picture = await ProfilePicture.find({
                where: {
                    user_id: userinfo.id
                }
            })
            profilePicture = `
            <div class="user">
                <div class="card-header">
                    <h3>Profile Picture</h3>
                    <img id="profilePicture" src="${picture.image}">
                </div>
            </div>`
        }

        if(req.url.vars.delete){
            if(req.url.vars.delete === "true"){
                new Modal({
                    title: 'Delete account',
                    body: `<h3>Are you sure you want to delete your account?</h3>`,
                    confirm: `<a href="?delete=confirm" class="btn btn-primary">Submit</a>`,
                    session: req.session
                })
                res.redirect('/user')
                return
            }
            else if(req.url.vars.delete === "confirm"){
                await User.delete({
                    where: {
                        id: userinfo.id
                    }
                })
                res.redirect('/')
                return
            }
        }

        let characters = CharacterParser.parse(await Character.select({
            select: [
                'characters.id', 'class.name', 'stats.level', 'characters.name as char_name'
            ],
            joins: [
                'INNER JOIN class ON class.id = characters.class_id',
                'INNER JOIN stats ON stats.id = characters.stats_id'
            ],
            where:{
                'characters.user_id': userinfo.id
            }
        }))

        let feed = await Feed.select({
            where:{
                user_id: userinfo.id
            }
        })
        let pageFeed = ''
        if(feed.length > 0){
            feed.map((f) => {
                let feedDate = new Date(f["time"])
                pageFeed += `
                <div>
                    <p style='font-size: 20px'>${f["message"]}</p>
                    <p>${feedDate.getDate()}/${feedDate.getMonth()+1}/${feedDate.getFullYear()} - ${feedDate.getUTCHours()}:${feedDate.getUTCMinutes()}</p>
                </div>`
              });
        }
        else{
            pageFeed = '<i>Its quite empty here</i>'
        }
        
        res.render('user', {
            USERNAME: userinfo.username,
            EMAIL: userinfo.email,
            PROFILEPICTURE: profilePicture,
            MODAL: req.session.modal || '',
            FEED: pageFeed,
            CHARACTER: characters
        })
        delete req.session.modal
    }

    static async HandlePostUser(req, res){
        if (!req.session.userinfo) {
            res.redirect("/")
            return
        }
        let userinfo = req.session.userinfo
        if(req.data.picture){
            if(!await ProfilePicture.findId({
                where: {
                    user_id: userinfo.id
                }
            })){
                await ProfilePicture.create({
                    image: req.data.picture,
                    user_id: userinfo.id
                })
                new Feedback({
                    type: 'info',
                    message: "Successfully made your profile picture",
                    session: req.session
                })
                res.redirect("/user")
            }
            else{
                await ProfilePicture.update({
                    data: {
                        image: req.data.picture,
                        updated_at: new Date(Date.now())
                    },
                    where: {
                        user_id: userinfo.id
                    }
                })
                new Feedback({
                    type: "alert-info",
                    message: "Successfully updated your profile picture",
                    session: req.session
                })
                res.redirect("/user")
            }
        }
    }

    static async HandleCharacters(req, res){
        if (!req.session.userinfo) {
            res.redirect("/")
            return
        }
        
        let stats = await Character.find({
            where:{
                'characters.id': req.url.vars.id
            },
            select: [
                'characters.kills', 'characters.deaths', 'characters.name', 'stats.health', 'stats.level', 'class.name'
            ],
            joins: [
                'INNER JOIN stats ON stats.id = characters.stats_id',
                'INNER JOIN class ON class.id = characters.class_id'
            ]
        })
        
        res.render('character', {
            STATS: `${stats.name}, ${stats.level}`,
            KD: `Your K/D (Kills divided by Deaths): ${CharacterParser.calculateKD(stats.kills, stats.deaths)} <br> 
                Health: ${stats.health} <br> Level: ${stats.level}`
        })
    }
}