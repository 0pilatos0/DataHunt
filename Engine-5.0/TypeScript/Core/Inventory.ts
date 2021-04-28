import Event from "./Event.js"
import IItemDictionary from "./Interfaces/IDictionary.js"
import Item from "./Item.js"

export default class Inventory extends Event{
    private _items: IItemDictionary = {}
    private _slots: number = 0

    constructor(){
        super()
    }

    public add(item: Item, amount: number = 1){
        item.amount = amount
        this._items[item.name] = item
    }
    
    public remove(item: Item, amount: number = 1){
        item.amount -= amount
        if(item.amount <= 0) this._items.splice(this._items.indexOf(item.name), 1)
    }

    public get items(){
        return this._items
    }
}