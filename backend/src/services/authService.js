const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

async function registerUser(email, password, age, username) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      age: parseInt(age),
      username
      // Other fields...
    },
    select: {
      id: true,
      username: true
    }
  });

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email},
    JWT_SECRET
  )

  console.log("New User: ", {... newUser, token})
  return {... newUser, token};
}

async function loginUser(email, password) {
  // Retrieve the user from the database
  const user = await getUserByEmail(email);
  if (user) {
    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Password matches
      const token = jwt.sign(
        { id: user.id, email: user.email},
        JWT_SECRET
      )
      delete user.password
      return {...user, token};
    } else {
      // Password does not match
      throw new Error('Invalid credentials');
    }
  } else {
    // User not found
    throw new Error('User not found');
  }
}

async function logInUserToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET)
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id
    },
    select: {
      id: true,
      username: true,
    }
  })
  return user
}

async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
      username: true,
      password: true
    }
  })
  return user
}

async function getUserById(userId) {
  try {
    const user = prisma.user.findUnique({
      where: {id: userId}
    })
    return user
  } catch (error) {
    console.log("Error getting user by id: ", error.message)
  }
}

async function addSocketId(socketId, userId) {
  try {
    const addedSocketId = await prisma.user.update({
      where: {id: userId},
      data: {
        socketIds: {
          push: socketId
        }
      }
    })
    return addedSocketId
  } catch (error) {
    console.log("Error adding socketId: ", error.message)
  }
}

async function removeSocketId(socketId, userId) {
  try {
    const socketIds = await getSocketIds(userId)
    const removedSocketId = await prisma.user.update({
      where: {id: userId},
      data: {
        socketIds: {
          set: socketIds.filter((id) => id !== socketId)
        }
      }
    })
    return removedSocketId
  } catch (error) {
    console.log("Error deleting socketId: ", error.message)
  }
}

async function getSocketIds(userId) {
  const {socketIds} = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      socketIds: true
    }
  })

  return socketIds
}

module.exports = {
  registerUser,
  loginUser,
  logInUserToken,
  getUserById,
  addSocketId,
  removeSocketId,
  getSocketIds
};
