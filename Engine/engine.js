import { Window } from "./Core/Window.js";

new Window()

window.spriteSize = 32 * 3

let init = async () => {
    for (let i = 0; i < window.windows.length; i++) {
        await window.windows[i].init()
    }

    window.updateFps = 0
    window.drawFps = 0

    setInterval(() => {
        for (let i = 0; i < window.windows.length; i++) {
            window.windows[i].update()
        }
        window.updateFps++
    }, Math.floor(1000/60));

    setInterval(() => {
        console.log(window.drawFps)
        //console.log(window.updateFps)
        window.drawFps = 0
        window.updateFps = 0
    }, 1000);

    render()
}

let render = () => {
    window.requestAnimationFrame(render)
    for (let i = 0; i < window.windows.length; i++) {
        window.windows[i].render()
    }
    window.drawFps++
}

init()