import { authService } from 'fbase';
import React, {useState} from 'react';

const AuthForm = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    // const [userName,setUserName] = useState("");
    const [newAccount,setNewAccount] = useState(true);
    const [error,setError] = useState("");

    const onChange = (e) =>{
        const {name,value} = e.target;
            if(name==="email"){
                setEmail(value);
            }else if(name==="password"){
                setPassword(value);
            }
    }
    const onSubmit = async (e) =>{
        e.preventDefault();
        let data;
        try{
            if(newAccount){
                //Create Account
                data = await authService.createUserWithEmailAndPassword(
                    email,password
                );

            }else{
                //Log In
                data = await authService.signInWithEmailAndPassword(
                    email,password
                );
            }
            // console.log(data);
        }catch(error){
            setError(error.message);
        }
    }
    
    const toggleAccount = () => setNewAccount((prev) =>!prev)

    return(
        <>
        <form className="container" onSubmit={onSubmit}>
                <input className="authInput" name="email" type="text" placeholder="Email" required 
                value={email} onChange={onChange}/>
                <input className="authInput" name="password" type="password" placeholder="Password" required 
                value={password} onChange={onChange}/>
        
                <input className="authInput authSubmit" type="submit" value={newAccount ? "Create Account":"Sign In"}/>
                {error && <span className="authError">{error}</span>}
        </form>
        <span className="authSwitch" onClick={toggleAccount}>
            {newAccount? "Sign In" : "Create Account"}
        </span>
        </>
    )
}
export default AuthForm;