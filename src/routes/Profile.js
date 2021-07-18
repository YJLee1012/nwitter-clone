import { authService } from 'fbase';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Profile = () =>{
    const history = useHistory();
    const onClickLogOut = () => {
        authService.signOut();
        history.push('/');
    }
    return(
        <>
        <button onClick={onClickLogOut}>Sign Out</button>
        </>
    )
}

export default Profile;