import {Vector2} from './Vector2.js'

export function drawRectangle(position, size){
    if(!(size instanceof Vector2) || !(position instanceof Vector2)) return
    window.ctx.rect(position.x, position.y, size.x, size.y)
    window.ctx.stroke()
}

export function drawRectangleWithColor(position, size, color){
    if(!(size instanceof Vector2) || !(position instanceof Vector2)) return
    window.ctx.fillStyle = color
    window.ctx.fillRect(position.x, position.y, size.x, size.y)
}

export function drawText(position, text, fontSize){
    if(!(position instanceof Vector2)) return
    window.ctx.font = `${fontSize}px Minecraft`
    window.ctx.fillStyle = "#FF0000"
    window.ctx.fillText(text, position.x, position.y)
}

export function drawSprite(position, sprite){
    if(!(position instanceof Vector2) || !(sprite instanceof Image)) return
    window.ctx.drawImage(sprite, position.x, position.y)
}