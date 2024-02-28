import React, { useContext, useState} from 'react';
import '../css/notification.css';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { unreadNotifications } from '../utils/unreadNotifications';
import moment from 'moment';

export default function Notification() {
    const [isOpen, setisOpen] = useState(false);
    const { notification, userChats, allUsers ,markallnotifs, markNotifAsRead} = useContext(ChatContext)
    const {user }=useContext(AuthContext)

    const unreadNotifs = unreadNotifications(notification);
    const modifiednotifications = notification?.map((n)=>{
        const sender=allUsers?.find(user => user._id === n.senderId)
        return{...n, senderName: sender?.name}

    })

  return (
    <div className='notifications'>
      <div className='notifications-icon' onClick={() =>setisOpen(!isOpen)} data-toggle="tooltip" data-placement="bottom" title="Notifications">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
</svg>
    {
            unreadNotifications?.length === 0 ? null : (
                <span className="notifs-count">
                <span>
                    {unreadNotifs?.length === 0 ? null : unreadNotifs?.length}
                </span>
                </span>
            )
        }
      </div>
      
      {
        isOpen && 
        <div  className='notifications-box'>
        <div className='notifications-header'>
            <div id='notifications-title'>Notifications</div>
            <div id='mark-as-read' onClick={()=>markallnotifs(notification)}>Mark all as read</div>
            </div>
           
            {
                modifiednotifications.length === 0 ?<span className='no-notification'>No notifications yet ...</span>
            :null
            }
            {
                modifiednotifications && modifiednotifications.map((n, i)=>(
                    <div key={i} className={n.isRead? "notification":"notification not-read"} 
                    onClick={()=>{markNotifAsRead(n, userChats, user, notification);
                    setisOpen(false)}} >
                        <div className='notif'>{n.senderName } send you a message</div>
                        <div className="notif notification-time">{moment(n.date).calendar()}</div>
                    </div>
                ))
            }
        
      </div>
      }
      
    </div>
  )
}
