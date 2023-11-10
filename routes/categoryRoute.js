const express = require('express')
const { createCategory } = require('../controllers/categoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()


router.post('/',authMiddleware, isAdmin, createCategory)

module.exports = router