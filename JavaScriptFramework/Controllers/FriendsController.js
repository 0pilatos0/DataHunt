const Controller = require("../Classes/Controller");
const Regex = require("../Classes/Regex");
const Feedback = require("../Helpers/Feedback");
const InputParser = require("../Helpers/InputParser");
const Feed = require("../Models/Feed");
const Friend = require("../Models/Friend");
const ProfilePicture = require("../Models/ProfilePicture");
const User = require("../Models/User")

module.exports = class HomeController extends Controller{
    constructor(){
        super()
    }

    static async HandleFriends(req, res){
        if(!req.session.userinfo){
            res.redirect('/')
            return
        }
        let userinfo = req.session.userinfo
        let friends = await Friend.select({
            where: {
                userA: `${userinfo.id} OR userB = ${userinfo.id}`,
            }
        })
        let friendsHTML = ''
        for (let i = 0; i < friends.length; i++) {
            let f = friends[i]
            if(f.userA == userinfo.id){
                f.name = await User.find({
                    select: [
                        'username'
                    ],
                    where: {
                        id: f.userB
                    }
                })
            }
            else{
                f.name = await User.find({
                    select: [
                        'username'
                    ],
                    where: {
                        id: f.userA
                    }
                })
            }
        }
        let profilePictures = await ProfilePicture.all()
        friends.map(async (f) => {  
            if(!f.name) {
                await Friend.delete({
                    where: {
                        id: f.id
                    }
                })
            }
            let profilePicture = profilePictures.find((p)=>{
                if(f.userA == userinfo.id){
                  return p.user_id == f.userB
                }else {
                  return p.user_id == f.userA
                }
            })
            friendsHTML += `
                <div class=\"card text-secondary w-75 mt-4\" style=\"width: 18rem;\">
                <div class=\"card-body\">`
            if(profilePicture){
                friendsHTML += `<img class="friendsPictures" src="${profilePicture.image}">`
            }
            friendsHTML += `
                <h5 class=\"card-title\">${f.name.username}</h5
            `
            if(!f.friendship && f.userA == userinfo.id){
                friendsHTML += `<p class=\"card-text\">User hasn't replied to your request yet.</p>`
            }
            else if(!f.friendship && f.userB == userinfo.id){
                friendsHTML += `
                    <p class="card-text">You have an incoming friend request.</p>
                    <form method="POST">
                        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                            <input type="radio" class="btn-check" name="btnradio" id="${f.id}btnradio1" autocomplete="off" checked value="AcceptRequest">
                            <label class="btn btn-outline-success" for="${f.id}btnradio1">Accept</label>
            
                            <input type="radio" class="btn-check" name="btnradio" id="${f.id}btnradio2" autocomplete="off" value="DeclineRequest">
                            <label class="btn btn-outline-danger" for="${f.id}btnradio2">Decline</label>
                        </div>
                        <input type="submit" class="btn btn-primary" value="Confirm">
                        <input type="hidden" name="id" value="${f.id}">
                    </form>`
            }
            else if(f.friendship){
                friendsHTML += `<p class=\"card-text\">You are friends.</p>`
            }
            friendsHTML += `</div></div>`
        })
        res.render('friends', {
            FRIENDS: friendsHTML
        })
    }

    static async HandleFriendsPost(req, res){
        let userinfo = req.session.userinfo
        let user = await User.find({
            select: [
                'username'
            ],
            where: {
                id: userinfo.id
            }
        })
        if(req.data["AccUsername"]){
            let username = InputParser.parse(req.data["AccUsername"])
            if(!username.match(Regex.Username)){
                new Feedback({
                    type: 'danger',
                    message: `The username doesn't follow our rules`,
                    session: req.session
                })
                res.redirect('/friends')
                return
            }
            let friendId = await User.find({
                select: [
                    'id'
                ],
                where: {
                    username
                }
            })
            friendId = friendId.id
            if(friendId == userinfo.id){
                new Feedback({
                    type: 'danger',
                    message: `You can't be friends with yourself`,
                    session: req.session
                })
                res.redirect('/friends')
                return
            }
            else{
                if(friendId){
                    let friendship = await Friend.find({
                        where: {
                            userA: userinfo.id,
                            userB: `${friendId} OR userA = ${friendId} AND userB = ${userinfo.id}`
                        }
                    })
                    if(friendship){
                        new Feedback({
                            type: 'danger',
                            message: `You are already friends with ${username}`,
                            session: req.session
                        })
                        if(!friendship.friendship && friendship.userA == friendId){
                            await Friend.update({
                                data:{
                                    friendship: 1
                                },
                                where:{
                                    id: friendship.id
                                }
                            })
                            res.redirect('/friends')
                            return
                        }
                        else{
                            res.redirect('/friends')
                            return
                        }
                    }
                    else{
                        new Feedback({
                            type: 'success',
                            message: `Send friend request to ${username}! :)`,
                            session: req.session
                        })
                        await Friend.create({
                            userA: userinfo.id,
                            userB: friendId,
                            friendship: 0
                        })
                        res.redirect('/friends')
                        return
                    }
                }
                else{
                    new Feedback({
                        type: 'danger',
                        message: `User ${username} doesn't exist`,
                        session: req.session
                    })
                    res.redirect('/friends')
                    return
                }
            }
        }
        else if(req.data.btnradio == "AcceptRequest"){
            await Friend.update({
                data:{
                    friendship: 1
                },
                where: {
                    id: req.data.id
                }
            })
            let friendship = await Friend.find({
                where: {
                    id: req.data.id
                }
            })
            let friend
            if(friendship.userA == userinfo.id){
                friend = friendship.userB
                friend = await User.find({
                    where: {
                        id: friend
                    }
                })
            }
            else{
                friend = friendship.userA
                friend = await User.find({
                    where: {
                        id: friend
                    }
                })
            }
            await Feed.create({
                user_id: userinfo.id,
                message: `You and ${friend.username} are now friends!`
            })
            await Feed.create({
                user_id: friend.id,
                message: `You and ${user.username} are now friends!`
            })
            res.redirect('/friends')
            return
        }
        else if(req.data.btnradio == "DeclineRequest"){
            await Friend.delete({
                where: {
                    id: req.data.id
                }
            })
            new Feedback({
                type: 'success',
                message: 'Successfully declined friendship',
                session: req.session
            })
            res.redirect('/friends')
            return
        }
    }
}