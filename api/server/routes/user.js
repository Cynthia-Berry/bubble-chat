const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user");
const TokenValidator = require("../middlewares/helpers/validators/token.validator");

router.get('/profile',TokenValidator.validateAuth, UserController.getUsers);
router.get('profile/:id',TokenValidator.validateAuth, UserController.getUserById);

module.exports = router;
