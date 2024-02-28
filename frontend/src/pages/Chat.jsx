import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import UserChat from '../components/UserChat'
import { AuthContext } from '../context/AuthContext'
import PotentielChat from '../components/PotentielChat'
import ChatBox from '../components/ChatBox'
import '../css/userchat.css'




export default function Chat() {

  const { user } = useContext(AuthContext)
  const { userChats, 
    isUserChatsLoading,
     userChatsError ,
     updateCurrentChat,
    onlineUsers} = useContext(ChatContext)


  return (<div >

    <div className='row container'  >
    <div className='col-1'></div>
    <div className='col-3' id='chats'>
      <h2 style={{margin:'20px', borderBottom:'1px solid rgb(255,255,255, 0.6)', padding:'10px'}}>Contacts</h2>

    {
      userChatsError?.error &&
       <div className='alert alert-danger'>
       error :{userChatsError.message}
       </div>
        
    }

    {
      userChats?.length<1  ? null :
      <ul>
        {isUserChatsLoading && <p>loading chat ... </p>}
        {
          userChats?.map((item, index)=>(
            <div id='userchat' className='userchatclass' key={index}  onClick={ ()=>updateCurrentChat(item)} >
              <UserChat chat={item} user={user}/>
            </div>
            
          ))
        }
      </ul>
    }
    </div>

      <div className='col-6' id='current-chat' >
      <div className='container'>
        <ChatBox />
      </div>
        
      </div>
    <div className='col-2'>
    <div className='container'>
    <PotentielChat />
    </div>
    </div>
    </div>
  </div>
    
  )

}
