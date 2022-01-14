const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000

app.get('/', (req, res) => {
  res.send('hellow world!')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})