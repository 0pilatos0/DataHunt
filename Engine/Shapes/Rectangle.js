import { BaseShape } from "./BaseShape.js"

export class Rectangle extends BaseShape{
    /**
     * @param {Vector2} position 
     * @param {Vector2} size
     * @param {String} color
     */
    constructor(position, size, color){
        super(position, size, color)
    }

    render(ctx){
        let color = ctx.fillStyle
        ctx.fillStyle = this.color
        ctx.fillRect(0, 0, this.size.x, this.size.y)
        ctx.fillStyle = color
    }
}