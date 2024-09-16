import { io } from "socket.io-client";
import { LOCAL_API_URL } from "@env";

const socket = io(LOCAL_API_URL)

socket.on('newMessage', (data) => {
    console.log("New message received: ", data)
})

export default socket