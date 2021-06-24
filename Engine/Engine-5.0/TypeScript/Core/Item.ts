import IDictionary, { IItemDictionary } from "./Interfaces/IDictionary"

export default class Item{
    private static _items: IItemDictionary = {}

    private _name: string
    private _amount: number = 1

    constructor(name: string){
        this._name = name
        Item._items[name] = this
    }

    public get name(){
        return this._name
    }

    public set amount(amount: number){
        this._amount = amount
    }

    public get amount(){
        return this._amount
    }

    public static get items(){
        return this._items
    }
}


Item.items["pizza"] = new Item("pizza")