module.exports = class Feedback{
    constructor({type, message, session}){
        session.alert = {
            type: `alert-${type}`,
            message
        }
    }
}