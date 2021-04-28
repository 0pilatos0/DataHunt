import Event from "./Event.js";
import Window from "./Window.js";
export default class Inventory extends Event {
    constructor() {
        super();
        this._items = {};
        this._slots = 0;
        this._opened = true;
        var client = new XMLHttpRequest();
        client.open('GET', './Elements/inventory.html');
        client.onreadystatechange = function () {
            // @ts-ignore: Object is possibly 'null'.
            document.querySelector('#inventory').innerHTML = client.responseText;
        };
        client.send();
        Window.active.input.on('press', (key) => {
            if (key == 'i') {
                if (this._opened) {
                    this.close();
                }
                else {
                    this.open();
                }
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
