import Event from "./Event.js";
import HTMLLoader from "./FileLoaders/HTMLLoader.js";
import Window from "./Window.js";
export default class Inventory extends Event {
    constructor() {
        super();
        this._items = {};
        this._slots = 0;
        this._opened = false;
        new HTMLLoader('/Engine-5.0/JavaScript/Elements/inventory.html').on('load', (data) => {
            // @ts-ignore: Object is possibly 'null'.
            document.querySelector('#inventory').innerHTML = data;
        });
        Window.active.input.on('press', (key) => {
            switch (key) {
                case 'i':
                    this._opened ? this.close() : this.open();
                    break;
                default:
                    break;
            }
        });
    }
    update() {
    }
    open() {
        var _a;
        (_a = document.querySelector('#inventory')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        this._opened = true;
    }
    close() {
        var _a;
        (_a = document.querySelector('#inventory')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        this._opened = false;
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
