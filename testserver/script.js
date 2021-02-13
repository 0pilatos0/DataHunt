let socket = io("https://datahuntserver.herokuapp.com:58563")

socket.on('connect', () => {
    console.log("connected")
})