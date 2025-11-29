import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

import PotentielChat from '../components/PotentielChat'
import PotentielChatModal from '../components/PotentielChatModal'
import ChatBox from '../components/ChatBox'
import UserChat from '../components/UserChat'

export default function Chat() {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat } = useContext(ChatContext);

  // State for controlling the mobile contacts sidebar
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  // State for controlling the "new users" modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="chat-page">
        {/* This is the contacts list, which becomes a sliding sidebar on mobile */}
        <aside className={`left-col mobile-sidebar ${isContactsOpen ? 'open' : ''}`}>
          <div className="contacts-header">
            <span>Messages</span>
            <div className="header-actions">
              {/* This is the single plus button to open the new users modal */}
              <button className="new-chat-btn" onClick={() => setIsModalOpen(true)} aria-label="Start new chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              {/* This button is only visible on mobile to close the sidebar */}
              <button className="close-sidebar-btn" onClick={() => setIsContactsOpen(false)} aria-label="Close contacts">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {userChatsError?.error && <div className="alert">{userChatsError.message}</div>}
          <div className="contacts-list">
            {isUserChatsLoading ? (
              // Skeleton loader
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-lines">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))
            ) : userChats?.length > 0 ? (
              userChats.map((c, i) => (
                <div key={i} onClick={() => {
                  updateCurrentChat(c);
                  setIsContactsOpen(false); // Close sidebar on mobile after selecting a chat
                }} className="contact-item">
                  {/* UserChat is now simplified, no longer needs the onOpenModal prop */}
                  <UserChat chat={c} user={user} />
                </div>
              ))
            ) : (
              <div className="muted">Start a new conversation</div>
            )}
          </div>
        </aside>

        <main className="main-col">
          {/* Pass the sidebar toggle function to ChatBox component */}
          <ChatBox onToggleContacts={() => setIsContactsOpen(!isContactsOpen)} />
        </main>
        
        {/* This is the desktop version of the "suggested users" panel */}
        <aside className="right-col desktop-only"><PotentielChat /></aside>
      </div>

      {/* This is the mobile version, rendered as a modal */}
      <PotentielChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        .chat-page {
          display: grid;
          grid-template-columns: 320px 1fr 300px;
          gap: 16px;
          height: calc(100vh - 60px); /* Adjust based on navbar height */
          padding: 16px;
          background-color: #f1f3f5;
        }
        .left-col, .right-col, .main-col {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .left-col, .right-col {
          max-height: calc(100vh - 92px);
        }
        .main-col {
          height: 100%;
        }
        .contacts-header {
          padding: 16px 20px;
          font-weight: 700;
          font-size: 18px;
          color: #212529;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .new-chat-btn {
          background: #4f46e5;
          border: none;
          color: white;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .new-chat-btn:hover {
          background: #4338ca;
          transform: scale(1.05);
        }
        .close-sidebar-btn {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: none; /* Hidden by default */
          align-items: center;
          justify-content: center;
        }
        .close-sidebar-btn:hover {
          background-color: #f1f3f5;
        }
        .contact-item {
          border-bottom: 1px solid #f1f3f5;
          transition: background-color 0.2s;
        }
        .contact-item:last-child {
          border-bottom: none;
        }
        .contact-item:hover {
          background-color: #f8f9fa;
        }
        .muted {
          color: #adb5bd;
          font-size: 14px;
          padding: 20px;
          text-align: center;
        }
        .alert {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 16px;
          border-radius: 0;
          margin-bottom: 0;
          font-size: 14px;
        }
        .skeleton-item { display: flex; align-items: center; gap: 12px; padding: 12px; }
        .skeleton-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
        .skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .skeleton-line { height: 12px; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
        .skeleton-line.short { width: 60%; }
        @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        
        /* --- RESPONSIVE LOGIC --- */

        /* On medium screens, hide the right column */
        @media (max-width: 1100px) {
          .chat-page { grid-template-columns: 280px 1fr; }
          .right-col { display: none; }
        }

        /* On small screens, switch to a single column layout and make the left column a sliding sidebar */
        @media (max-width: 720px) {
          .chat-page { grid-template-columns: 1fr; padding: 0; }
          .main-col { border-radius: 0; }
          
          /* Mobile Sidebar Styling */
          .mobile-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 80vw;
            max-width: 320px;
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform 0.3s ease-out;
            border-radius: 0;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          }
          .mobile-sidebar.open {
            transform: translateX(0);
          }
          .close-sidebar-btn {
            display: flex; /* Show the close button */
          }
          .desktop-only { display: none !important; } /* Hide the desktop-only panel */
        }
      `}</style>
    </>
  );
}