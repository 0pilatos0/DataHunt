let socket = io("https://datahuntserver.herokuapp.com")

socket.on('connect', () => {
    console.log("connected")
})