import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import합니다.

function LandingPage() {
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.

  useEffect(() => {
    axios.get('/api/hello')
      .then(response => console.log(response.data))
  }, [])

  const onClickHandler = () => {
    axios.get(`/api/users/logout`)
      .then(response => {
        if (response.data.success) {
          navigate('/login'); // 로그아웃 시 '/login'으로 이동합니다.
        } else {
          alert("로그아웃 하는데 실패하였습니다.")
        }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>Initial Page</h2>

      <button onClick={onClickHandler}>
        Log out
      </button>
    </div>
  )
}

export default LandingPage;
