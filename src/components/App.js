import React, {useState, useEffect} from 'react';
//절대경로 사용
import AppRouter from 'components/Router'
import {authService} from 'fbase';

function App() {
  const [init,setInit] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [userObj,setUserObj] = useState(null);


  // authService.currentUser는 로그인되었는지 알아차리지 못함
  // firebase를 기다려주어 로그인 되었다는 사실 알아차릴 수 있음
  useEffect(()=>{
    authService.onAuthStateChanged((user)=> {
      if(user){
        setIsLoggedIn(true);
        setUserObj({
          // user에 있는 정보 필요한 것만 가져오도록 만들어줌
          displayName: user.displayName ? user.displayName : user.email, //createUser시 displayName이 없으므로 기본값으로 email 지정
          uid : user.uid,
          photoURL : user.photoURL,
          updateProfile : (args) => user.updateProfile(args),
        });
        console.log('userObj',userObj);

      }else{
        setIsLoggedIn(false);
        setUserObj(null);
      }

      //init이 false라면 router를 숨길 것이기 때문
      setInit(true);
    });
  },[]);


  const refreshUser = () => {
    // console.log(authService.currentUser);
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName ? user.displayName : user.email,
      uid : user.uid,
      photoURL : user.photoURL,
      updateProfile : (args) => user.updateProfile(args),
    });
  }

  return (
    <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} refreshUser={refreshUser} /> : "Initializing..."}
    <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
