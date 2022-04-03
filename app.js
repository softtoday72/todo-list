const express = require('express')
const session = require('express-session')
const app = express()
const exphbs = require('express-handlebars')
//這行要在 express-session後面
const usePassport = require('./config/passport')

const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
//本來路徑應該要打 ./routes/index  但是在import路由器的時候就會自動找叫 index的檔案 , 所以打到資料夾就好 
const routes = require('./routes')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//忘記加下面這行 , 結果認證永遠是  req.isAuthenticated() False
//擺在 app.use(routes) 的後面, 就無法生成 connect.sid
//因為app.use是一種middleware(中斷插件)，有順序性，先app.use加入的會先被執行，因為routes需要用到secret來驗證session產生connect.sid，所以一定要加在app.use(routes)之前
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

//這行要在路由前面 app.use(routes)
usePassport(app)
app.use(flash())
//在 usePassport(app) 之後、app.use(routes) 之前，加入一組 middleware
app.use((req, res, next) => {
  
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  //flash-message
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息

  next()
})

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