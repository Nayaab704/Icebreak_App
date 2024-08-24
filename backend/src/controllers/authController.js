const authService = require('../services/authService');


async function register(req, res) {
  const { email, password, age, username } = req.body;
  console.log(req.body)
  try {
    const {id, token} = await authService.registerUser(email, password, age, username);
    res.status(201).json({id, token});
  } catch (error) {
    console.log("Error: ", error)
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  const {email, password} = req.body

  try {
    const {id, token} = await authService.loginUser(email, password)
    res.status(201).json({id, token});
  } catch (error) {
    console.log("Error: ", error)
    res.status(400).json({ error: error.message });
  }
}

async function verifyToken(req, res) {
  const checkToken = req.body.token
  try {
    const {id, token} = await authService.logInUserToken(checkToken)
    res.status(201).json({id, token});
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
}

module.exports = {
  register,
  login,
  verifyToken
};
