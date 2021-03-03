import { BaseShape } from "./BaseShape.js"

export class Rectangle extends BaseShape{
    /**
     * @param {Vector2} position 
     * @param {Vector2} size
     * @param {String} color
     */
    constructor(width, height, color){
        super(width, height, color)
    }

    render(ctx){
        let color = ctx.fillStyle
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
        ctx.fillStyle = color
    }
}