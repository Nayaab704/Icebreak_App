const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.post("/search_users", chatController.search_users)
router.post("/create_group", chatController.create_group)
router.post("/get_user_groups", chatController.get_user_groups)

module.exports = router