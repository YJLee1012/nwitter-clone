import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import {v4 as uuidv4} from "uuid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const NweetFactory = ({userObj}) => {
    const [nweet,setNweet] = useState("");
    const [attachment,setAttachment] = useState("");
    //create
    const onSubmit = async (e) =>{
        if(nweet === ""){
            return;
        }
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
    const onClearAttachment = () => setAttachment('');
    return(
        <form className="factoryForm" onSubmit={onSubmit}>
            <div className="factoryInput__container">
                <input className="factoryInput__input" onChange={onChange} value={nweet} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input className = "factoryInput__arrow" type="submit" value="&rarr;" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file" style={{opacity: 0,}} onChange={onFileChange} type="file" accept="image/*"/>
            {attachment && 
                <div className="factoryFrom__attachment">
                    <img src={attachment} style={{backgroundImage : attachment,}}/>
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            }
        </form>
    )
}
export default NweetFactory;