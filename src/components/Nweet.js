import { dbService } from 'fbase';
import React from 'react';

const Nweet = ({nweetObj, isOwner}) =>{
    const [editing,setEditing] = useState(false);
    const [editNweet,setEditNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok){
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
        }
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text:editNweet,
            // ...nweetObj
        });
        setEditing(false);
    }
    const onChange = (e) => {
        const value = e.target; //same  const {target : {value} }= e;
        setEditNweet(value);
    }
    return(
        <div>
            {editing ? ( 
                <>
                <form onSubmit={onSubmit}>
                    <input onChange={onChange} type="text" placeholder="Edit your nweet" value={editNweet} required />
                    <input type="submit" value="Update Nweet"/>
                </form>
                <button onClick={toggleEditing}>Cancel</button>
                </>
            ):(
                <>
                <h4>{nweetObj.text}</h4>
                {/* isOwner true일때만 삭제, 수정 보이도록 한다. */}
                { (isOwner) && (<>
                <button onClick={onDeleteClick}>Delete Nweet</button>
                <button onClick={toggleEditing}>Edit Nweet</button>
                </>) }
                </>
            )
            }
        </div>
    )
}
export default Nweet;