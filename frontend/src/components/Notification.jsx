import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const { notification, allUsers, markallnotifs, markNotifAsRead } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const modifiedNotifs = notification?.map(n => {
    const sender = allUsers?.find(u => u._id === n.senderId);
    return { ...n, senderName: sender?.name };
  });

  const unreadCount = notification?.filter(n => !n.isRead).length || 0;

  return (
    <>
      <div className="notif-container">
        <div className="notif-icon" onClick={() => setIsOpen(!isOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <span className="notif-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </div>

        {isOpen && (
          <div className="notif-dropdown">
            <div className="notif-header">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={() => markallnotifs(notification)} className="mark-btn">Mark all as read</button>
              )}
            </div>
            <div className="notif-body">
              {modifiedNotifs?.length === 0 ? (
                <div className="empty">No new notifications</div>
              ) : (
                modifiedNotifs.map((n, i) => (
                  <div key={i} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={() => markNotifAsRead(n, null, user, notification)}>
                    <div className="notif-icon-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div className="notif-content">
                      <span className="notif-text">{n.senderName} sent you a message</span>
                      <span className="notif-time">{moment(n.date).fromNow()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .notif-container { position: relative; }
        .notif-icon {
          cursor: pointer;
          position: relative;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        .notif-icon:hover {
          background-color: #f8f9fa;
        }
        .notif-count {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #dc3545;
          color: white;
          font-size: 10px;
          font-weight: 600;
          border-radius: 50%;
          padding: 2px 5px;
          min-width: 18px;
          text-align: center;
        }
        .notif-dropdown {
          position: absolute;
          top: 40px;
          right: 0;
          width: 300px;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 100;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e9ecef;
          font-weight: 600;
          color: #212529;
        }
        .mark-btn {
          background: none;
          border: none;
          color: #4f46e5;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .mark-btn:hover {
          background-color: #f0f2ff;
        }
        .notif-body {
          max-height: 350px;
          overflow-y: auto;
        }
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f3f5;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .notif-item:hover {
          background-color: #f8f9fa;
        }
        .notif-item.unread {
          background-color: #f0f2ff;
        }
        .notif-icon-placeholder {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notif-content {
          flex: 1;
        }
        .notif-text {
          display: block;
          font-size: 14px;
          color: #212529;
          margin-bottom: 4px;
        }
        .notif-time {
          display: block;
          font-size: 12px;
          color: #6c757d;
        }
        .empty {
          text-align: center;
          color: #adb5bd;
          padding: 20px 0;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}