import React,{useState,useEffect} from 'react';
import { dbService, storageService } from 'fbase';
import {v4 as uuidv4} from "uuid";
import Nweet from 'components/Nweet';

const Home = ({userObj}) =>{
    const [nweet,setNweet] = useState("");
    //nweets는 모든 nweet들
    const [nweets,setNweets] = useState([]);
    const [attachment,setAttachment] = useState("");
    
    //getting the nweets
    // //이 방식은 오래된 데이터를 가져온다.(no real time) 새로 생성/변경된 데이터는 새로고침해야 반영된다.
    // const getNweets = async () => {
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach((document)=>{
    //         const nweetObject = {
    //             ...document.data(),
    //             id : document.id,
    //         }
    //         setNweets(prev => [nweetObject,...prev])
    //     });
    // }

    //read
    useEffect(()=>{
        // getNweets();
        
        //getting nweets real-time (onSnapshot 이용)
        dbService.collection('nweets').orderBy("createdAt","desc").onSnapshot((snapshot)=>{
            const nweetArray = snapshot.docs.map((doc)=>({
                id:doc.id,
                ...doc.data(),
            }))
            setNweets(nweetArray);
        })
    },[])

    //create
    const onSubmit = async (e) =>{
        e.preventDefault();
        let attachmentUrl="";
        if(attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj =  {
            text:nweet,
            createdAt:Date.now(),
            creatorId:userObj.uid,
            attachmentUrl,
        }
        await dbService.collection("nweets").add(nweetObj);
        setNweet('');
        setAttachment('');
    }

    const onChange = (e) => {
        const {target : {value} }= e;
        setNweet(value);
    }
    const onFileChange = (e) => {
        // console.log(e.target.files);
        const {target:{files}} = e;
        const thefile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setAttachment(finishedEvent.currentTarget.result);
        }
        reader.readAsDataURL(thefile);
    }
    const onClearAttachment = () => setAttachment(null);
    console.log(nweets)
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={nweet} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input onChange={onFileChange} type="file" accept="image/*"/>
                <input type="submit" value="Nweet"/>
                {attachment && 
                    <div>
                    <img src={attachment} width="50px" height="50px"/>
                    <button onClick={onClearAttachment}>Clear</button>
                    </div>
                }
            </form>
            <div>
                {nweets.map(nweet=>(
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}

export default Home;