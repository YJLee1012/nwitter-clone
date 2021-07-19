import React,{useState,useEffect} from 'react';
import { dbService } from 'fbase';

import Nweet from 'components/Nweet';

const Home = ({userObj}) =>{
    const [nweet,setNweet] = useState("");
    const [nweets,setNweets] = useState([]);
    
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

    const onSubmit = async (e) =>{
        e.preventDefault();
        await dbService.collection("nweets").add({
            //can write whatever data you want
            text:nweet,
            createdAt:Date.now(),
            creatorId:userObj.uid,
            // creatorEmail:userObj.email,
        })
        setNweet('');
    }
    const onChange = (e) => {
        const {target : {value} }= e;
        setNweet(value);
    }
    console.log(nweets)
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={nweet} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input type="submit" value="Nweet"/>
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