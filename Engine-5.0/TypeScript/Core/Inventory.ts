import Event from "./Event.js"
import HTMLLoader from "./FileLoaders/HTMLLoader.js"
import IItemDictionary from "./Interfaces/IDictionary.js"
import Item from "./Item.js"
import Window from "./Window.js"

export default class Inventory extends Event{
    private _items: IItemDictionary = {}
    private _slots: number = 0
    private _opened: boolean = false

    constructor(){
        super()
        new HTMLLoader('/Engine-5.0/JavaScript/Elements/inventory.html').on('load', (data: any) => {
            // @ts-ignore: Object is possibly 'null'.
            document.querySelector('#inventory').innerHTML = data
        })

        Window.active.input.on('press', (key:string) => {
            switch (key) {
                case 'i':
                    this._opened ? this.close() : this.open()
                    break;
            
                default:
                    break;
            }
        })
    }

    public update(){
        
    }

    public open(){
        document.querySelector('#inventory')?.classList.remove('hidden')
        this._opened = true
    }

    public close(){
        document.querySelector('#inventory')?.classList.add('hidden')
        this._opened = false
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