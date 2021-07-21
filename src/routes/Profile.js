import React,{useEffect, useState} from 'react';
import { authService, dbService } from 'fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({userObj, refreshUser}) =>{
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onClickLogOut = () => {
        authService.signOut();
        history.push('/');
    }

    const getMyNweets = async () => {
        //db data filtering
        const nweets = await dbService.collection("nweets").where("creatorId","==",userObj.uid).orderBy("createdAt").get();
        console.log(nweets.docs.map(doc=>doc.data()));
    }

    useEffect(()=>{
        getMyNweets();
    },[]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName,
            })
        }
        refreshUser();
    }

    const onChange = (e) => {
        setNewDisplayName(e.target.value);

    }

    return(
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="display name" value={newDisplayName} />
            <input type="submit" value="Edit ProfileName" />
        </form>
        <button onClick={onClickLogOut}>Sign Out</button>
        </>
    )
}

export default Profile;