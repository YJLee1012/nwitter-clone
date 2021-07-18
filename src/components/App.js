import React, {useState, useEffect} from 'react';
//절대경로 사용
import AppRouter from 'components/Router'
import {authService} from 'fbase';

function App() {
  const [init,setInit] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  // authService.currentUser는 로그인되었는지 알아차리지 못함
  // firebase를 기다려주어 로그인 되었다는 사실 알아차릴 수 있음
  useEffect(()=>{
    authService.onAuthStateChanged((user)=> {
      if(user){
        setIsLoggedIn(true)
      }else{
        setIsLoggedIn(false)
      }
      //init이 false라면 router를 숨길 것이기 때문
      setInit(true)
    });
  },[]);

  return (
    <>
    {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initializing..."}
    <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
