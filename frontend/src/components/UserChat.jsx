// src/components/UserChat.js

import React, { useContext, useState, useEffect } from 'react';
import { useFetchChat } from '../hooks/useFetchChat';
import { ChatContext } from '../context/ChatContext';
import moment from 'moment';
import { useLatestMessage } from '../hooks/useLatestMessage';

export default function UserChat({ chat, user }) {
  // The hook now returns the full recipientUser object, including lastSeen
  const { recipientUser, error: fetchError } = useFetchChat(chat, user);
  const { onlineUsers, notification, markthisnotifasread } = useContext(ChatContext);

  const latest = useLatestMessage(chat);
  const unread = (notification || []).filter(n => !n.isRead && n.senderId === recipientUser?._id);
  const isOnline = onlineUsers?.some(u => u.userId === recipientUser?._id);
  const truncate = t => t ? (t.length > 30 ? t.slice(0, 30) + '…' : t) : '';

  // --- Helper function to format the real last seen time ---
  const formatLastSeen = (date) => {
    if (!date) return "";
    const now = new Date();
    const lastSeenDate = new Date(date);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Active now";
    if (diffInMinutes < 60) return `last seen ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `last seen ${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `last seen on ${lastSeenDate.toLocaleDateString()}`;
  };
  
  // Handle case where data is still loading or there's an error
  if (fetchError) {
    return <div className="user-chat-row error">Error loading user.</div>;
  }
  if (!recipientUser) {
    return <div className="user-chat-row loading">Loading user...</div>;
  }

  return (
    <>
      <div 
        className="user-chat-row" 
        role="button" 
        onClick={() => {
          if(unread.length) markthisnotifasread(unread);
        }}
      >
        <div className="user-left">
          <div className="avatar">
            {recipientUser?.name?.[0]?.toUpperCase()}
            <span className={`status-dot ${isOnline ? 'online' : ''}`}></span>
          </div>
        </div>

        <div className="user-mid">
          <div className="username">{recipientUser?.name}</div>
          <div className="preview">{truncate(latest?.text)}</div>
        </div>

        <div className="user-right">
          <div className="time">{latest?.createdAt ? moment(latest.createdAt).fromNow() : ''}</div>
          {unread.length > 0 && <div className="badge">{unread.length}</div>}
          
          {/* --- Use the REAL last seen time from the user object --- */}
          {!isOnline && recipientUser?.lastSeen && (
            <div className="last-seen-status">
              {formatLastSeen(recipientUser.lastSeen)}
            </div>
          )}
        </div>
      </div>

      <style>{`.user-chat-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid transparent;
          background: #fff;
          transition: all 0.2s ease;
        }
        .user-chat-row:hover {
          background: #f8f9fa;
          transform: translateX(4px);
        }
        .user-left { display: flex; align-items: center; }
        .avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }
        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #dee2e6;
          border: 3px solid #fff;
        }
        .status-dot.online { background-color: #10b981; }
        .user-mid {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        .username { font-weight: 600; font-size: 15px; color: #212529; }
        .preview {
          font-size: 13px;
          color: #6c757d;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }
        .time { font-size: 11px; color: #adb5bd; }
        .badge {
          background: #dc3545;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }
        .last-seen-status {
          font-size: 11px;
          color: #6c757d;
          text-align: right;
          max-width: 120px;
        }
        .error, .loading { justify-content: center; color: #6c757d; font-style: italic; }`}</style>
    </>
  );
}