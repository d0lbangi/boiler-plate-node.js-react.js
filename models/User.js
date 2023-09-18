const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // 스페이스의 공백을 없애줌
    unique: 1 // 똑같은 email을 쓰게 하지 못하도록
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number, // ex) number:0 관리자, number: 일반유저
    default: 0 // 임의로 role을 정하지 않으면 role의 type 을 0으로 주겠다.
  },
  image: String,
  token: { // 유효성
    type: String
  },
  tokenExp: {
    type: Number
  }
})

const User = mongoose.model('User', userSchema)

mongoose.model.export = {User}