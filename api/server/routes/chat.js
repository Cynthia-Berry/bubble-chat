const express = require('express');
const router = express.Router();
const ChatController = require("../controllers/chat");
const TokenValidator = require("../middlewares/helpers/validators/token.validator");

router.get('/messages/:id',TokenValidator.validateAuth, ChatController.getChatByUserId);

module.exports = router;
