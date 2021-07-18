import { authService } from 'fbase';
import React, {useState} from 'react';

const Auth = () => {
    const [email,setEmaiil] = useState("");
    const [password,setPassword] = useState("");
    const [newAccount,setNewAccount] = useState(false);

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
            console.log(data);
        }catch(error){
            console.log(error);
        }
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required 
                value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required 
                value={password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account":"Log In"}/>
            </form>
            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button>

            </div>
        </div>

    )
}

export default Auth;