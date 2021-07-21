import React,{useEffect, useState} from 'react';
import { authService, dbService, storageService } from 'fbase';
import { useHistory } from 'react-router-dom';
import Nweet from 'components/Nweet';
import {v4 as uuidv4} from "uuid";


const Profile = ({userObj, refreshUser}) =>{
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [newPhoto,setNewPhoto] = useState(userObj.photoURL);
    const [myNweets,setMyNweets] = useState([]);


    const onClickLogOut = () => {
        authService.signOut();
        history.push('/');
    }

    const getMyNweets = async () => {
        //db data filtering //where메소드 사용
        await dbService.collection('nweets').where("creatorId","==",userObj.uid).orderBy("createdAt","desc").onSnapshot((snapshot)=>{
            const nweetArray = snapshot.docs.map((doc)=>({
                id:doc.id,
                ...doc.data(),
            }))
            setMyNweets(nweetArray);
        })
    }

    useEffect(()=>{
        getMyNweets();
    },[]);

    const onProfileNameSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName,
            })
        }
        refreshUser();
    }

    const onProfileNameChange = (e) => {
        setNewDisplayName(e.target.value);
    }
    
    const onProfileImageSubmit = async(e) => {
        e.preventDefault();
        let photoUrl="";
        if(newPhoto !== ""){
            //수정시 이전 프로필이미지 삭제
            await storageService.refFromURL(userObj.photoURL).delete();
            //파일에 대한 reference 생성
            const newPhotoRef = storageService.ref().child(`profile/${uuidv4()}`);
            const response = await newPhotoRef.putString(newPhoto, "data_url");
            photoUrl = await response.ref.getDownloadURL();
        }
        if(userObj.photoURL !== photoUrl){
            await userObj.updateProfile({
                photoURL : photoUrl,
            })
        }
        setNewPhoto('');
        refreshUser();
    }
    
    const onProfileImageChange = (e) => {
        const thefile = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setNewPhoto(finishedEvent.currentTarget.result);
        }
        reader.readAsDataURL(thefile);
    }

    return(
        <>
        <img src={userObj.photoURL} width='50px' height='50px' />
        <form onSubmit={onProfileImageSubmit}>
            <input onChange={onProfileImageChange} type="file" accept="image/*" />
            <input type ="submit" value="프로필 사진 변경" />
        </form>
        <form onSubmit={onProfileNameSubmit}>
            <input onChange={onProfileNameChange} type="text" placeholder="display name" value={newDisplayName} />
            <input type="submit" value="닉네임 변경" />
        </form>
        <button onClick={onClickLogOut}>Sign Out</button>

        {myNweets.map((myNweet)=>(
            <Nweet key={myNweet.createdAt} nweetObj={myNweet} isOwner={myNweet.creatorId === userObj.uid}/>
        ))}
        </>
    )
}

export default Profile;