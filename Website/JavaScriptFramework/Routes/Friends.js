const Route = require("../Classes/Route");
const FriendsController = require("../Controllers/FriendsController");

module.exports = class Friends extends Route{
    constructor() {
        super('')

        this.get('/friends', FriendsController.HandleFriends)

        this.post('/friends', FriendsController.HandleFriendsPost)
    }
}