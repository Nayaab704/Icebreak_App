const prisma = require('./prismaClient');

async function sendNotificationToGroupMembers(userId, message) {
    console.log("Sending ", message, " to ", userId)
}

module.exports = {
    sendNotificationToGroupMembers
}