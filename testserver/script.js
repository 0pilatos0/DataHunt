let socket = io("https://datahuntserver.herokuapp.com:32071")

socket.on('connect', () => {
    console.log("connected")
})