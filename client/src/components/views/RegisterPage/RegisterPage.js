import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import합니다.

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  }

  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  }

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  }

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
      email: Email,
      password: Password,
      name: Name
    }

    dispatch(registerUser(body))
      .then(response => {
        if (response.payload.success) {
          navigate('/login'); // 회원가입 성공 시 '/login'으로 이동합니다.
        } else {
          alert('Failed to sign up')
        }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <button type="submit">
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default RegisterPage;
