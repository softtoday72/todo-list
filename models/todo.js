const mongoose = require('mongoose')
const Schema = mongoose.Schema
//建立Schema的實例
const todoSchema = new Schema({
  //name 是屬性
  name: {
    type: String, //資料型別:字串
    required: true, //必填欄位
  },
  isDone:{
    type:Boolean,
    default: false,
  },
  userId: {  // 加入關聯設定
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})
//透過 module.exports 把這個 schema 輸出 ,匯出的時候我們把這份 schema 命名為 Todo
module.exports = mongoose.model('Todo', todoSchema)