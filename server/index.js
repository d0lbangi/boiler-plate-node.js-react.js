const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: true }));

// application/json 
app.use(cookieParser());
app.use(express.json());

const mongoose = require('mongoose');

mongoose.connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected....'))
  .catch(err => console.error(err)); // 오류 시 에러 메시지를 출력

// TEST
app.get('/', (req, res) => res.send('Hello World!~~ '));
app.get('/api/hello', (req, res) => res.send('Hello World!~~ '));

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요 ~")
}) // 프론트로 메시지 전달



app.post('/api/users/register', async (req, res) => {
  // req.body로 클라이언트에서 보낸 데이터를 받아와 User 모델을 생성
  const user = new User(req.body);

  try {
    // 데이터베이스에 저장
    const userInfo = await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err); // 에러 시 에러 메시지를 출력
    res.status(500).json({
      success: false,
      err: err.message, // 에러 메시지를 응답으로 전달
    });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    // 요청된 이메일을 데이터베이스에서 조회
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
    }

    // 비밀번호까지 맞다면 토큰을 생성
    const token = await user.generateToken();

    // 토큰을 저장 (쿠키에 저장)
    res.cookie("x_auth", token)
      .status(200)
      .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    console.error(err); // 에러 시 에러 메시지를 출력
    res.status(500).json({
      success: false,
      err: err.message
    });
  }
});

// role 1 어드민      role 2 특정 부서 어드민
// role 0 -> 일반유저 role 이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authenticaiton이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// 로그아웃이라면 로그인 상태이기 때문에 중간에 auth 를 넣어주면 된다. 
app.get('/api/users/logout', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: '' });
    res.clearCookie('x_auth').status(200).send({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      err: err.message,
    });
  }
});

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
