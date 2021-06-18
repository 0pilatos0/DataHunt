module.exports = class CharacterParser{
    constructor() {
        
    }

    static parse(characters){
        let returnData = ''
        characters.map(c => {
            returnData += `
            <li class=\"list-group-item char-li\">
                <a class=\"char-link\" href=\"character?id=${c["id"]}\">
                    <div class='char'>
                        ${c["char_name"]}<br>Lvl ${c["level"]} - ${c["name"]}
                    </div>
                </a>
            </li>`
        })
        return returnData
    }

    static calculateKD(k, d){
        return Math.round(k/d * 100) / 100
    }
}