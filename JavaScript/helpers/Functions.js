const { User } = require("./User")

module.exports.Functions = class {
    constructor(){

    }

    static async deleteAccount(id){
        Object.keys(req.session).map(k => {
            if(k != 'id') delete req.session[k]
        })
        return await User.delete(id)
    }

    static async adminDelete(id){
        return await User.delete(id)
    }
    
    static showCharacters(characters){
        if(characters.length > 0){
            let returnData = ''
            for (let i = 0; i < characters.length; i++){
                let c = characters[i]
                returnData += `
                <li class=\"list-group-item char-li\">
                    <a class=\"char-link\" href=\"character?id=${c["id"]}\">
                        <div class='char'>
                            ${c["char_name"]}<br>Lvl ${c["level"]} - ${c["name"]}
                        </div>
                    </a>
                </li>`
            }
            return returnData
        }
        else if(characters.id){
            return `
                <li class=\"list-group-item char-li\">
                    <a class=\"char-link\" href=\"character?id=${characters["id"]}\">
                        <div class='char'>
                            ${characters["char_name"]}<br>Lvl ${characters["level"]} - ${characters["name"]}
                        </div>
                    </a>
                </li>`
        }
    }

    static changeInput(data){
        data = data.trim()
        data = data.replace(/\\(.)/mg, "$1")
        data = data
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
        return data
    }

    static createButtons(id){
        return `<p class="card-text">You have an incoming friend request.</p>
        <form method="post">
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="btnradio" id="${id}btnradio1" autocomplete="off" checked value="AcceptRequest">
                <label class="btn btn-outline-success" for="${id}btnradio1">Accept</label>

                <input type="radio" class="btn-check" name="btnradio" id="${id}btnradio2" autocomplete="off" value="DeclineRequest">
                <label class="btn btn-outline-danger" for="${id}btnradio2">Decline</label>
            </div>
            <input type="submit" class="btn btn-primary" value="Confirm">
            <input type="hidden" name="id" value="${id}">
        </form>`
    }

    static calculateKD(k, d){
        return Math.round(k/d * 100) / 100
    }
}