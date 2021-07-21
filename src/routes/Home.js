import React,{useState,useEffect} from 'react';
import { dbService, storageService } from 'fbase';
import Nweet from 'components/Nweet';
import NweetFactory from 'components/NweetFactory';

const Home = ({userObj}) =>{
    //nweets는 모든 nweet들
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

    console.log(nweets)
    return(
        <div>
            <NweetFactory userObj={userObj} />
            <div>
                {nweets.map(nweet=>(
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}

export default Home;