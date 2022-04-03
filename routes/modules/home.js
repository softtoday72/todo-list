//引用express & express 路由器
const express = require('express')
const router = express.Router()
//引用 Todo model 與資料庫互動
const Todo = require('../../models/todo')
//定義首頁路由器
router.get('/', (req, res) => {
  const userId = req.user._id 
  Todo.find({ userId: req.user._id }) //取出 Todo model 資料
    .lean()   //把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ _id: 'asc' }) //asc從小到大 , desc反過來
    .then(todos => res.render('index', { todos: todos }))
    .catch(error => console.log(error))
})

module.exports = router