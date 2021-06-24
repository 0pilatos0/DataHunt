export default class Item {
    constructor(name) {
        this._amount = 1;
        this._name = name;
        Item._items[name] = this;
    }
    get name() {
        return this._name;
    }
    set amount(amount) {
        this._amount = amount;
    }
    get amount() {
        return this._amount;
    }
    static get items() {
        return this._items;
    }
}
Item._items = {};
Item.items["pizza"] = new Item("pizza");
