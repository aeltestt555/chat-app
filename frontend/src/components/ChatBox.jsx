import React, { useContext, useRef, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { useFetchChat } from '../hooks/useFetchChat'
import { Stack } from 'react-bootstrap'
import '../css/userchat.css'


export default function ChatBox() {
    const {user} = useContext(AuthContext)
    const { currentChat , messages, isMessagesLoading, sendtextmessage} = useContext(ChatContext)
    const { recipientUser } = useFetchChat(currentChat, user)
    const [textMessage, settextMessage] = useState('');
    const scroll = useRef()
    
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);

    if(!recipientUser) return(
        <p>
            NO CONVERTION SELECTED YET ... 
            Please select a conversation to start messaging.
        </p>
    )
    if(isMessagesLoading) return (
        <p>
            LOADING CHAT ...
        </p>
    )
    return (
    <>
        <div className='row '>
        <div id='currentusername'>
        <strong>{ recipientUser?.name}</strong>
      </div>
      </div>
      <div className='chatbox row '>
            { messages?.length>0 && messages?.map((m, index)=> (
                        <>
                     <div id='infomsg' ref={scroll}>
                            <div key={index} className={`${m?.senderId === user?._id  ?"msg self col align-self-end ": "msg other col align-self-start"}`}>
                                                <div id='inlinemsg'>
                                                    <div id='textmsg'>{m.text}</div>
                                                <div id='timemsg'>{new Intl.DateTimeFormat('en-GB', {year: 'numeric',month: 'long',day: '2-digit', hour:'numeric', minute:'numeric'}).format(new Date(m.createdAt))}</div>
                                                
                                                </div>
                                                    </div>
                                                </div>
                                            
                        </>
                                    
                                ))}
                                
      </div>

        
        <form className='row ' id='sendmessagecontainer' onSubmit={(e)=>sendtextmessage(e, textMessage, user, currentChat._id, settextMessage)}>
            <div className='col-10' >
                <input id="sendmsginput" type="text" 
                value={textMessage} onChange={(e) => settextMessage(e.target.value)}
                autoComplete="off" 
                />
            </div>
            <div className='col-2' >
                <button type='submit' id='sendmsgbutton'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
</svg>
                </button>
            </div>
        </form>
            
     
    </>
      
      
      
      
  )
}
