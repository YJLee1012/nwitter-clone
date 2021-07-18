import React, {useState} from 'react';
//절대경로 사용
import AppRouter from 'components/Router'
import {authService} from 'fbase';

function App() {
  // const auth = fbase.auth();
  const [isLoggedIn,setIsLoggedIn] = useState(authService.currentUser);


  return (
    <>
    <AppRouter isLoggedIn={isLoggedIn}/>
    <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
