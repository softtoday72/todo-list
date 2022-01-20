const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
//本來路徑應該要打 ./routes/index  但是在import路由器的時候就會自動找叫 index的檔案 , 所以打到資料夾就好 
const routes = require('./routes')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)
//app.engine 這一行我們只是在應用程式裡新增了一個叫 hbs 的樣板引擎，但要到 app.set 這一行，這個 hbs 元件才正式掛載到我們的主程式裡，開始啟用。和之前的課程相比，在呼叫 exphbs 的時候，除了設定預設樣板，還多了一組設定 extname: '.hbs'，是指定副檔名為.hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

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


// app.use(routes) 取代了下面的所有路由

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})