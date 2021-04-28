import Event from "./Event.js";
export default class Inventory extends Event {
    constructor() {
        super();
        this._items = {};
        this._slots = 0;
    }
    add(item, amount = 1) {
        item.amount = amount;
        this._items[item.name] = item;
    }
    remove(item, amount = 1) {
        item.amount -= amount;
        if (item.amount <= 0)
            this._items.splice(this._items.indexOf(item.name), 1);
    }
    get items() {
        return this._items;
    }
}
