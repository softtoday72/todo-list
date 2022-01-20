//引用express & express 路由器
const express = require('express')
const router = express.Router()
//引用 Todo model 與資料庫互動
const Todo = require('../../models/todo')

//這邊的所有路由 app改成 router , /todos去掉 因為近來這邊都是前面有 /todos的路由 , 而 /todos這類前綴詞都寫在 總路由器index裡面
router.get('/new', (req, res) => {
  return res.render('new')
})
//新增一筆
// todos 這條路由會利用 Todo 這個 model 在資料庫創建資料 , 然後重導回首頁
//下面這行本來是 "/todos" 去掉後變成 "/"
router.post('/', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
//瀏覽特定
// 接住 detail前面產生的動態連結 前往 detail.hbs
router.get('/:id', (req, res) => {
  // this._id被 params抓下來存進變數 id裡面
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo: todo }))
    .catch(error => console.log(error))
})

//修改特定
//進入修改頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo: todo }))
    .catch(error => console.log(error))
})
//送出修改資料
router.put('/:id', (req, res) => {
  const id = req.params.id  //來自GET 所以用 params
  //這寫法叫 解構賦值 (destructuring assignment)
  const { name, isDone } = req.body //來自 POST 所以用 body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name //右邊的name是表單中填寫的name 左邊是資料庫中原本的值
      todo.isDone = isDone === 'on' //isDone === 'on'的回傳值為布林值
      return todo.save() //存起來!
    })
    .then(() => res.redirect(`/todos/${id}`)) //返回瀏覽特定頁 , 瀏覽特定頁在自己去跟資料庫請資料, 重構新畫面
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//將檔案匯出
module.exports = router