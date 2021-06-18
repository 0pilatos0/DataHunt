const pluralize = require('pluralize')
const Regex = require('./Regex')
const SQL = require('./SQL')

module.exports = class Model{
    static table
    constructor() {
        
    }

    static async select({where, limit, orderBy, joins, select}){
        let obj = SQL.parseWhereData(where)
        where = obj.where
        let values = obj.values
        return global.sql.query(`SELECT ${select ? `${select.join(', ')}` : '*'} FROM ${this.tableName} ${joins ? joins.join(' ') : ''} ${where ? `WHERE ${where}` : ''} ${orderBy ? `${orderBy.toUpperCase()}` : ''} ${limit ? `LIMIT ${limit}` : ''}`, values)
    }

    static async update({where, data}){
        let setObj = SQL.parseSetData(data)
        let values = setObj.values
        data = setObj.set
        let whereObj = SQL.parseWhereData(where)
        where = whereObj.where
        values = values.concat(whereObj.values)
        return global.sql.query(`UPDATE ${this.tableName} SET ${data} ${where ? `WHERE ${where}` : ''}`, values)
    }

    static async delete({where}){
        let obj = SQL.parseWhereData(where)
        where = obj.where
        let values = obj.values
        return global.sql.query(`DELETE FROM ${this.tableName} ${where ? `WHERE ${where}` : ''}`, values)
    }

    static async create(data){
        let obj = SQL.parseCreateData(data)
        let values = obj.values
        let valuesString = obj.valuesString
        let create = obj.create
        return global.sql.query(`INSERT INTO ${this.tableName} (${create}) VALUES (${valuesString})`, values)
    }

    static async last({where} = {}){
        let last = await this.select({
            limit: 1,
            orderBy: 'ORDER BY id DESC',
            where
        })
        if(last.length != undefined) return last[0]
        else return false
    }

    static async first({where} = {}){
        let first = await this.select({
            limit: 1,
            where
        })
        if(first.length != undefined) return first[0]
        else return false
    }

    static async find({where, joins, select}){
        let data = await this.select({
            where, 
            joins,
            select
        })
        if(data.length > 0) return data[0]
        else return false
    }

    static async findId({where, joins}){
        let data = await this.select({
            where,
            joins,
            select:['id']
        })
        if(data.length > 0) return data[0]
        else return false
    }

    static async all(){
        return this.select({})
    }

    static get tableName(){
        return pluralize(this.name).toLowerCase()
    }
}