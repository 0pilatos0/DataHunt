module.exports.User = class {
    constructor(){

    }

    static async info(id){
        return global.sql.query(`SELECT users.*, user_roles.role_id FROM users INNER JOIN user_roles where users.id = ${id} AND user_roles.user_id = ${id}`)
    }

    static async delete(id){
        return global.sql.query(`DELETE FROM users where id = ${id}`)
    }

    static async getMultiple(){
        return global.sql.query(`SELECT users.*, user_roles.role_id FROM users INNER JOIN user_roles WHERE users.id = user_roles.user_id`)
    }

    /**
    * getStats
    * @param int
    * 
    * gets your current selected characters stats!
    * kills & deaths, level and
    *
    * @return array
    */
    static async getStats(id){
        return global.sql.query(`SELECT characters.kills, characters.deaths, characters.name, stats.health, stats.level, class.name FROM characters INNER JOIN stats ON stats.id = characters.stats_id INNER JOIN class ON class.id = characters.class_id  WHERE characters.id = ${id}`)
    }

    static async characters(id){
        return global.sql.query(`SELECT characters.id, class.name, stats.level, characters.name as char_name FROM characters INNER JOIN class ON class.id = characters.class_id INNER JOIN stats ON stats.id = characters.stats_id where characters.user_id = ${id}`)
    }

    static async addToFeed(id, message){
        return global.sql.query(`INSERT INTO users_feed (user_id, message) VALUES (${id}, ${message})`)
    }

    static async getFeed(id){
        return global.sql.query(`SELECT * FROM users_feed where user_id = ${id}`)
    }

    /**
    * set friendship
    * @param int
    * @param int
    * @param int
    *
    * userA will always be the person that send the request first!
    * 0 = userA send request userB didn't accept nor decline
    * 1 = userA and UserB are friends
    *
    * @return void
    */
   static async setFriendShip(userA, userB, friendship){
       return global.sql.query(`INSERT INTO friends (userA, userB, friendship) VALUES (${userA}, ${userB}, ${friendship})`)
   }
   /**
   * updatefriendship
   * @param int
   * @param int
   *
   * Allows you to update friendships
   *
   * @return void
   */
  static async updateFriendship(friendshipID, friendship){
    return global.sql.query(`UPDATE friends SET friendship=${friendship} WHERE id=${friendshipID}`)
  }

  static async getFriendship(userA, userB, id = null){
    if(id == null){
        return global.sql.query(`SELECT * FROM friends WHERE userA = (${userA}) AND userB = (${userB}) OR userA = (${userB}) AND userB = (${userA})`)
    }
    else{
        return global.sql.query(`SELECT * FROM friends WHERE id = ${id}`)
    }
  }

  static async deleteFriendship(id){
    return global.sql.query(`DELETE FROM friends WHERE id=${id}`)
  }

  static async getMutlipleFriendships(id){
      return global.sql.query(`SELECT * FROM friends WHERE userA = (${id}) OR userB = (${id})`)
  }

  static async getUserId(username){
    return global.sql.query(`SELECT id FROM users where username = '${username}'`)
  }

  static async getUsername(id){
      return global.sql.query(`SELECT username FROM users where id = ${id}`)
  }

  static async makePatchnote(title, text){
    return global.sql.query(`INSERT INTO patchnotes (title, note) VALUES ('${title}, ${text}')`)
  }

  static async get(username){
      return global.sql.query(`SELECT * FROM users WHERE username = '${username}'`)
  }

  static async getPatchnotes(){
      return global.sql.query(`SELECT * FROM patchnotes ORDER BY id DESC`)
  }
}