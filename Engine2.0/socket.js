import { Socket } from "./Core/Socket.js"

let socket = new Socket()

let connectInterval = setInterval(() => {
    console.clear()
    if(socket.connected) {
        console.log("connected")
        gameLoader.style.display = "none"
        clearInterval(connectInterval)
    }
}, 2000)