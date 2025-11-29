import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

export default function PotentielChatModal({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const { potentielChat, createChat, onlineUsers } = useContext(ChatContext);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Start a new chat</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {potentielChat?.length === 0 && <div className="empty">No new users available</div>}
          {potentielChat?.map(u => {
            const isOnline = onlineUsers?.some(o => o.userId === u._id);
            return (
              <div key={u._id} className="pot-item-modal" onClick={() => {
                createChat(user._id, u._id);
                onClose(); // Close modal after starting a chat
              }}>
                <div className="pot-avatar">
                  {u.name?.[0]?.toUpperCase()}
                  {isOnline && <span className="online-indicator"></span>}
                </div>
                <div className="pot-details">
                  <div className="pot-name">{u.name}</div>
                  <div className="pot-status">{isOnline ? 'Active now' : 'Offline'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: flex-end; /* Slide up from bottom */
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          width: 100%;
          max-width: 100%;
          height: 75vh;
          border-radius: 20px 20px 0 0;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e9ecef;
        }
        .modal-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #212529;
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          background-color: #f1f3f5;
        }
        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        .pot-item-modal {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .pot-item-modal:hover {
          background-color: #f8f9fa;
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
          flex-shrink: 0;
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
        .pot-details {
          flex: 1;
        }
        .pot-name {
          font-size: 16px;
          font-weight: 500;
          color: #212529;
        }
        .pot-status {
          font-size: 13px;
          color: #6c757d;
        }
        .empty {
          padding: 20px;
          color: #adb5bd;
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}