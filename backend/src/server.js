const express = require('express');
const { MongoClient } = require('mongodb');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes')
const chatRoutes = require('./routes/chatRoutes');
const { get_group_members_minus_current_user } = require('./services/chatService');
const { sendNotificationToGroupMembers } = require('./notification');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes)
app.use('/api/chat', chatRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
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

        groupMembers.forEach(member => {
          sendNotificationToGroupMembers(member.user.id, "Sending message")
        })
      }
    })
  } catch (error) {
    console.log("Error watching messages")
  }
}

