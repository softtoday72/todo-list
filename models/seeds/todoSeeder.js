//載入上一層資料夾裡面的todo.js (一個點是同層, 兩個是上一層 , 只有斜線是根目錄)
//把todo.js匯出的模型塞進Todo裡面
const Todo = require('../todo')

//require db 進來後, mongoose.js的內容會被執行 , 因此seeder只要接著執行剩下的一段就可以了
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i })
  }
  console.log('done')
})