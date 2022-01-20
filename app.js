const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
//本來路徑應該要打 ./routes/index  但是在import路由器的時候就會自動找叫 index的檔案 , 所以打到資料夾就好 
const routes = require('./routes')

//對 app.js 而言，Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數去接
require('./config/mongoose')

// app.use(routes) 取代了下面的所有路由
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

//app.engine 這一行我們只是在應用程式裡新增了一個叫 hbs 的樣板引擎，但要到 app.set 這一行，這個 hbs 元件才正式掛載到我們的主程式裡，開始啟用。和之前的課程相比，在呼叫 exphbs 的時候，除了設定預設樣板，還多了一組設定 extname: '.hbs'，是指定副檔名為.hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})