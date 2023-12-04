const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const validator = require('../middlewares/services/validator')
const tokenValidators = require("../middlewares/helpers/validators/token.validator");

router.post('/register', validator("validator", "auth"), authController.register);

router.post('/login', validator("validator", "auth"), authController.login);

router.get('/logout', tokenValidators.validateAuth, authController.logout);

module.exports = router;