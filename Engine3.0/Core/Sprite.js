var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Canvas from "./Canvas.js";
import Event from "./Event.js";
import Vector2 from "./Vector2.js";
export default class Sprite extends Event {
    constructor(path, size, data) {
        super();
        this._sprite = null;
        this.init(path, size, data);
    }
    init(path, size, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let img = new Image();
            img.onload = () => {
                let canvas = new Canvas(new Vector2(img.width, img.height));
                canvas.ctx.drawImage(img, 0, 0, size.x, size.y);
                this._sprite = canvas.element;
                this.trigger('load', this._sprite);
            };
            img.src = path;
        });
    }
    get sprite() {
        return this._sprite;
    }
}
