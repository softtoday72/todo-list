const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
//import todo.js裡面的 module.exports = mongoose.model('Todo', todoSchema)
const Todo = require('./models/todo')

//app.engine 這一行我們只是在應用程式裡新增了一個叫 hbs 的樣板引擎，但要到 app.set 這一行，這個 hbs 元件才正式掛載到我們的主程式裡，開始啟用。和之前的課程相比，在呼叫 exphbs 的時候，除了設定預設樣板，還多了一組設定 extname: '.hbs'，是指定副檔名為.hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
//這邊的todo-list是mongoose資料庫名稱
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })

//把connection內容抓下來
const db = mongoose.connection

//(on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生)
db.on('error', () => {
  console.log('mongodb error!')
})

//這邊的once表示監聽器只用一次就會刪掉, 節省資源 , open指的是連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  Todo.find() //取出 Todo model 裡的所有資料
    .lean()   //把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ _id: 'asc' }) //asc從小到大 , desc反過來
    .then(todos => res.render('index', {todos: todos}))
    .catch(error => console.log(error))
})

app.get('/todos/new', (req,res) => {
  return res.render('new')
})
//新增一筆
// todos 這條路由會利用 Todo 這個 model 在資料庫創建資料 , 然後重導回首頁
app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
//瀏覽特定
// 接住 detail前面產生的動態連結 前往 detail.hbs
app.get('/todos/:id', ( req, res ) => {
  // this._id被 params抓下來存進變數 id裡面
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo: todo }))
    .catch(error => console.log(error))
})

//修改特定
//進入修改頁面
app.get('/todos/:id/edit', (req,res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', {todo: todo}))
    .catch(error => console.log(error))
})
//送出修改資料
app.put('/todos/:id', (req, res) => {
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

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})