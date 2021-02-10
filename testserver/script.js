let socket = io("http://localhost:3000")//, { transport : ['websocket'] })

socket.on('connect', () => {
    console.log("connected")
})