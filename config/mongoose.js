const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/todo-list'

//這邊的todo-list是mongoose資料庫名稱
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true} )

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

module.exports = db