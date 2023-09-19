const { User } = require('../models/User');

let auth = (req, res, next) => {

  // 인증 처리를 하는 곳곳

  // 클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;

  // 토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true }) // 클라이언트 이런식으로 전해주는 것

    // 토큰과 유저를  request에 넣어줌으로써 유저와 토큰 정보를 가질 수 있다.
    req.token = token;
    req.user = user;

    next(); // next가 없으면 미들웨어에 갇혀버리게되므로 넣어줘야한다
  })
}

module.exports = { auth };