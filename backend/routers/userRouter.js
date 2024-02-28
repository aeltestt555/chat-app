

const express = require('express');
const router = express.Router();

const { login, register, findUser, getUsers } = require('../Controllers/userController');

router.post('/register', register )
router.post('/login', login )
router.get('/find/:userId', findUser )
router.get('/', getUsers )

module.exports = router;