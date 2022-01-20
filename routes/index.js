const express = require('express')
const router = express.Router()
const home = require('./modules/home')
//import todo.js裡面的 module.exports = mongoose.model('Todo', todoSchema)
const todos = require('./modules/todos')

router.use('/', home)
router.use('/todos', todos)


module.exports = router