import React from 'react';
import { authService, firebaseInstance } from 'fbase';
import AuthForm from 'components/AuthForm';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
    const onSocialClick = async (e) =>{
        let provider;
        if(e.target.name==='google'){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if(e.target.name==='github'){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);
    }
    return(
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            <AuthForm />
            <div className="authBtns">
                <button className="authBtn" onClick={onSocialClick} name="google"><FontAwesomeIcon icon={faGoogle} /> Continue with Google</button>
                <button className="authBtn" onClick={onSocialClick} name="github"><FontAwesomeIcon icon={faGithub} /> Continue with Github</button>

            </div>
        </div>

    )
}

export default Auth;