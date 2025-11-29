import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

export default function PotentielChat() {
  const { user } = useContext(AuthContext);
  const { potentielChat, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <>
      <div className="potentiel-box">
        <div className="pot-header">Suggested for you</div>
        <div className="pot-list">
          {potentielChat?.length === 0 && <div className="empty">No new users</div>}
          {potentielChat?.map(u => {
            const isOnline = onlineUsers?.some(o => o.userId === u._id);
            return (
              <div key={u._id} className="pot-item" onClick={() => createChat(user._id, u._id)}>
                <div className="pot-avatar">
                  {u.name?.[0]?.toUpperCase()}
                  {isOnline && <span className="online-indicator"></span>}
                </div>
                <div className="pot-name">{u.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .potentiel-box {
          padding: 16px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .pot-header {
          font-weight: 700;
          margin-bottom: 16px;
          font-size: 16px;
          color: #212529;
        }
        .pot-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pot-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #e9ecef;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          text-align: center;
        }
        .pot-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.06);
          border-color: #dee2e6;
        }
        .pot-avatar {
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
          margin-bottom: 8px;
        }
        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #10b981;
          border: 3px solid #fff;
        }
        .pot-name {
          font-size: 14px;
          font-weight: 500;
          color: #495057;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
        .empty {
          padding: 20px;
          color: #adb5bd;
          text-align: center;
          font-size: 14px;
        }

        /* Mobile: horizontal scroll */
        @media (max-width: 720px) {
          .pot-list {
            flex-direction: row;
            overflow-x: auto;
            gap: 12px;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch; /* for smooth scrolling on iOS */
          }
          .pot-item {
            flex: 0 0 auto;
            min-width: 100px;
          }
          .pot-avatar {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
          .pot-name {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}