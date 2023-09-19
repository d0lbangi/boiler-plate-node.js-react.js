const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
        })
      })
  } else {
      next()
  }
})

// plainPassword 1234567 암호화된 비밀번호 $2b$10$oYxMVbCt46SOgq8CidSp9.GNQd/0SRUapHiQ3TWE978/0D2YZja7i
userSchema.methods.comparePassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
};


userSchema.methods.generateToken = function (cb) {
  const user = this;
  // console.log('user._id', user._id)

  // jsonwebtoken을 이용해서 토큰 생성하기
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  // user._id + 'secretTOken' = token
  // ->
  // 'secretToken' -> user._id

  user.token = token;
  
  return user.save().then(()=> {
    return token;
  });
};

userSchema.statics.findByToken = function(token, cb) {
  var user = this;

  // 토큰을 decode 한다.
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ "_id" : decoded, "token" : token }, function (err, user) {
      if(err) return cb(err);
      cb(null,  user)
    })
  })
}

const User = mongoose.model('User', userSchema);
module.exports = { User };