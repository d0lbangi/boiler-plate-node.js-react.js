const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
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
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

// 몽구스에서 가져온 메소드인데, save를 해주면 유저 모델에 유저 정보를 저장하기 전에 function을 만들어 무엇을 진행하겠다. 다 끝나면 저장하는 순서로 가게 된다.
userSchema.pre('save', function( next ) {
  
  var user = this;

  if(user.isModified('password')) {

    // 비밀번호를 암호화 시킨다.
    // bcrypt를 가져와서 salt를 만들고 만들 때 saltRounds가 필요하고, 에러가 나면 받아주는 콜백 function을 만들어서
    // bcrpyt를 가져와서 순수하게 넣은 비밀번호를 첫번째 인자(myplaintextPassword = user.password) 로 넣고 다시 콜백 function을 생성해준다. 
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)
      
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      });
    });
  }
})

const User = mongoose.model('User', userSchema);

module.exports = { User };