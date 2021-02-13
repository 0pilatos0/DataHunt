let socket = io("https://datahuntserver.herokuapp.com:53525")

socket.on('connect', () => {
    console.log("connected")
})