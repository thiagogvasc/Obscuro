const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/', authController.getSession)
router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.delete('/logout', authController.logout)

module.exports = router