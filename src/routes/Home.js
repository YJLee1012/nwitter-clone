import React,{useState} from 'react';
import { dbService } from 'fbase';

const Home = () =>{
    const [nweet,setNweet] = useState("");
    const onSubmit = async (e) =>{
        e.preventDefault();
        await dbService.collection("nweets").add({
            //can write whatever data you want
            nweet,
            createdAt:Date.now(),
        })
        setNweet('');
    }
    const onChange = (e) => {
        const {target : {value} }= e;
        setNweet(value);
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={nweet} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input type="submit" value="Nweet"/>
            </form>
        </div>
    )
}

export default Home;