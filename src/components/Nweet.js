import { dbService, storageService } from 'fbase';
import React,{useState} from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) =>{
    const [editing,setEditing] = useState(false);
    const [editNweet,setEditNweet] = useState(nweetObj.text);

    //delete
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok){
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            if(nweetObj.attachmentUrl){
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
            }
        }
    }
    //update
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text:editNweet, 
        });
        setEditing(false);
    }
    const onChange = (e) => {
        // const {target:{value}} = e;
        setEditNweet(e.target.value);
    }
    return(
        <div className="nweet">
            {editing ? ( 
                <>
                <form className="container nweetEdit" onSubmit={onSubmit}>
                    <input onChange={onChange} type="text" placeholder="Edit your nweet" value={editNweet} required />
                    <input className="formBtn" type="submit" value="Update Nweet"/>
                </form>
                <button className="formBtn cancelBtn" onClick={toggleEditing}>Cancel</button>
                </>
            ):(
                <>
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
                {/* isOwner true일때만 삭제, 수정 보이도록 한다. */}
                { (isOwner) && (<>
                {/* <button onClick={onDeleteClick}>Delete Nweet</button>
                <button onClick={toggleEditing}>Edit Nweet</button> */}
                <div className="nweet__actions">
                    <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                </div>
                </>) }
                </>
            )
            }
        </div>
    )
}
export default Nweet;