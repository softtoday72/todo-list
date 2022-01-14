const mongoose = require('mongoose')
//載入上一層資料夾裡面的todo.js (一個點是同層, 兩個是上一層 , 只有斜線是根目錄)
//把todo.js匯出的模型塞進Todo裡面
const Todo = require('../todo')
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i })
  }
  console.log('done')
})