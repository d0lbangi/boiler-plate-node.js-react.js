const express = require('express');
const app = express();
const port = 5000;

const { User } = require("./models/User");

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jeonghopark:thfla1823612@cluster0.sp9hwu8.mongodb.net/?retryWrites=true&w=majority', {})
  .then(() => console.log('MongoDB Connected....'))
  .catch(err => console.log(err))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!여기보세요오오오!!!')
})

app.post('/register', async (req, res) => {
  // req.body로 클라이언트에서 보낸 데이터를 받아와 User 모델을 생성
  const user = new User(req.body);

  try {
    // 데이터베이스에 저장
    const userInfo = await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      err: err.message, // 에러 메시지를 응답으로 전달
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
