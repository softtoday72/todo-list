const express = require('express')
const router = express.Router()
const home = require('./modules/home')
//import todo.js裡面的 module.exports = mongoose.model('Todo', todoSchema)
const todos = require('./modules/todos')
const users = require('./modules/users')
const auth = require('./modules/auth')

//載入auth.js
const { authenticator } = require('../middleware/auth')


router.use('/todos', authenticator,  todos) // 加入驗證程序
router.use('/users',users) //登入者資料不用驗證
router.use('/auth', auth) //不用驗證
router.use('/', authenticator, home) // 加入驗證程序

module.exports = router