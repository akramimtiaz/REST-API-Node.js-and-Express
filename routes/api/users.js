const express = require('express');
const router = express.Router();

const authenticateUser = require('./misc/authenticate');
const validate = require('./misc/validation/user');
const controller = require('../../controllers/users');


router.get('/', authenticateUser, controller.getUser);

router.post('/', validate.userInfo, controller.createUser);

module.exports = router;