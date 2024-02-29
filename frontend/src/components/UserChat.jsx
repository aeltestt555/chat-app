import React, { useContext } from 'react'
import { useFetchChat } from '../hooks/useFetchChat'
import '../css/userchat.css'
import { ChatContext } from '../context/ChatContext'
import { unreadNotifications } from '../utils/unreadNotifications'
import { useFetchLastMsg } from '../hooks/useFetchLastMsg'
import moment from 'moment'

export default function UserChat({chat , user}) {

    const { recipientUser } = useFetchChat(chat, user)
    //console.log('this:',recipientUser)
    const { onlineUsers, notification, markthisnotifasread} = useContext(ChatContext)
    const unreadNotifs = unreadNotifications(notification)
    const thisUserNotifs = unreadNotifs?.filter(
      item => item.senderId == recipientUser?._id
      )
      const isOnline = onlineUsers?.some(
        user => user.userId === recipientUser?._id
      )
      const {latestMsg }=useFetchLastMsg(chat)
      const truncateText=(text)=>{
        let shortText = text.substring(0, 10)
        if(text.length > 10){
          shortText = shortText + '...';
        }
        return shortText
      }
  return (
    <div role='button' id='friendchat' style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}
    onClick={()=>{
      if(thisUserNotifs?.length !== 0){
        markthisnotifasread(
          thisUserNotifs,
          notification
        )
      }
    }}> 
       <div className='col-4'>
        <div id='recipientusername'>{recipientUser?.name }</div>
        <div id='lastmsg'>{
          latestMsg?.text && 
            (<>{truncateText(latestMsg?.text)}</>)
        }</div>
       </div>
        <div className='col-3'></div>
        <div className='col-5' style={{display:'flex', flexDirection:'column'}}>
        <div >
          <div className={isOnline ?"dot" : ""} style={{float:'right'}}></div>
        </div>
              <div id='lastmsg-time'>{moment(latestMsg?.createdAt).calendar()}</div>
              <div>
                <div className={thisUserNotifs?.length>0? "newmsgcount":""} >{thisUserNotifs?.length>0 && thisUserNotifs?.length}</div>
              </div>
                    
        </div>
    </div>
  )
}
