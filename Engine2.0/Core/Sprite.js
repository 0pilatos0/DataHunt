export async function Sprite(path){
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, window.spriteSize, window.spriteSize)
            return resolve(canvas)
        }
        img.onerror = () => {
            return resolve(false)
        }
        img.src = path
    })
}

export async function CustomImage(path){
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => {
            return resolve(img)
        }
        img.onerror = () => {
            return resolve(false)
        }
        img.src = path
    })
}