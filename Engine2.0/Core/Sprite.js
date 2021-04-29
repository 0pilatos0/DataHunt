export async function Sprite(path){
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, window.spriteSize, window.spriteSize)
            return resolve(canvas)
        }
        img.onerror = () => {
            return resolve(false)
        }
        img.src = path
    })
}