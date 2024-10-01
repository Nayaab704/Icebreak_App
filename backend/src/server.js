const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes')
const chatRoutes = require('./routes/chatRoutes');
const { get_group_members_minus_current_user } = require('./services/chatService');
const { addSocketId, removeSocketId, getUserById, getSocketIds } = require('./services/authService');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
  origin: "http://localhost:3000",
  // methods: ['POST']
}))
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes)
app.use('/api/chat', chatRoutes)

var connectedUsers = new Map()

const PORT = process.env.PORT || 5000;

console.log("PORT: ", PORT)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  watchMessages()
});

async function watchMessages() {
  const client = new MongoClient(process.env.DATABASE_URL)

  try {
    await client.connect()
    const db = client.db('Prisma')
    const messagesCollection = db.collection('Message')

    // Watch the entire Message collection
    const changeStream = messagesCollection.watch()

    changeStream.on('change', async (next) => {
      if(next.operationType === 'insert') {
        const newMessage = next.fullDocument
        console.log("New Message Detected: ", newMessage)

        const groupMembers = await get_group_members_minus_current_user(newMessage.groupId, newMessage.senderId)
        const {id, username} = await getUserById(newMessage.senderId)

        groupMembers.forEach(async (member) => {
          try {
            const userSocketIds = await getSocketIds(member.user.id)
            console.log("Socket Ids of ", member.user.username)
            userSocketIds.forEach((socketId) => {
              console.log("Sending Message to: ", socketId)
              io.to(socketId).emit('newMessage', {
                groupId: newMessage.groupId,
                content: newMessage.content,
                mediaType: newMessage.mediaType,
                sender: {
                  id,
                  username
                },
                createdAt: newMessage.createdAt,
                id: newMessage._id,
                url: newMessage.url
              })
            })
          } catch (error) {
            console.log("Error getting user socketIds")
          }
        })
      }
    })
  } catch (error) {
    console.log("Error watching messages")
  }
}

io.on('connection', (socket) => {
  console.log("A new user connected: ", socket.id)

  socket.on('joinGroup', async (userId) => {
    console.log("UserId:", userId)
    try {
      await addSocketId(socket.id, userId)
      connectedUsers.set(socket.id, userId)
      console.log(connectedUsers)
    } catch (error) {
      console.log("Error adding socketId: ", error.message)
    }
  })

  socket.on('leaveGroup', async () => {
    console.log("User leaving group")
    await leaveGroup(socket.id)
  }) 

  socket.on('disconnect', async () => {
    console.log('A user disconnected: ', socket.id)
    await leaveGroup(socket.id)
  })
})

const leaveGroup = async (socketId) => {
  try {
    const userId = connectedUsers.get(socketId)
    connectedUsers.delete(socketId)
    if(userId) {
      await removeSocketId(socketId, userId)
    }
  } catch (error) {
    console.log("Error leaving group: ", error.message)
  }
}

