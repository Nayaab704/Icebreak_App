const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

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
      console.log("Matched")
      const token = jwt.sign(
        { id: user.id, email: user.email},
        JWT_SECRET
      )
      return {...user, token};
    } else {
      // Password does not match
      console.log("Didn't Match")
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
    }
  })
  return user
}

async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  console.log("Found User")
  return user
}

module.exports = {
  registerUser,
  loginUser,
  logInUserToken
};
