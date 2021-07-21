import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import {v4 as uuidv4} from "uuid";


const NweetFactory = ({userObj}) => {
    const [nweet,setNweet] = useState("");
    const [attachment,setAttachment] = useState("");
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
    return(
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
    )
}
export default NweetFactory;