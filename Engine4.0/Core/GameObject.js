import Transform from "./Transform.js";
export default class GameObject extends Transform {
    constructor(position, size, spriteIndex = -1, type = 0 /* DEFAULT */) {
        super(position, size);
        this._type = type;
        this._spriteIndex = spriteIndex;
    }
}
