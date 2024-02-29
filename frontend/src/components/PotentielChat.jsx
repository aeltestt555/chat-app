import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import '../css/userchat.css'

export default function PotentielChat() {
    const {user} = useContext(AuthContext)
    const { potentielChat, createChat, onlineUsers } = useContext(ChatContext)
    
  return (
    <div className='potentielusers-box'>
        
            {
                potentielChat && potentielChat.map((u, index)=>(
                        <div role='button' className='potentieluser' key={u._id}
                        onClick={() => createChat(user._id, u._id)}><span>{u.name}</span> <span className={
                          onlineUsers?.some((user)=>user?.userId === u?._id) ?
                        "dot" : ""}></span></div>
                ))
            }
    </div>
  )
}
