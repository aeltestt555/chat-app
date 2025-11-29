import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useFetchChat } from "../hooks/useFetchChat";

export default function ChatBox({ onToggleContacts }) { // Add the onToggleContacts prop
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading, sendtextmessage, isTyping, setIsTyping } = useContext(ChatContext);
  const { recipientUser } = useFetchChat(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const scroll = useRef();
  const typingTimeoutRef = useRef(null);

  // Handle typing indicator
  const handleInputChange = (e) => {
    setTextMessage(e.target.value);
    
    if (!isUserTyping) {
      setIsUserTyping(true);
      // Send typing indicator to server (implementation would depend on your backend)
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
      // Send stop typing indicator to server
    }, 3000);
  };

  // Add emoji to message
  const addEmoji = (emoji) => {
    setTextMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Format last seen
  const formatLastSeen = (date) => {
    if (!date) return "";
    const now = new Date();
    const lastSeenDate = new Date(date);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "online now";
    if (diffInMinutes < 60) return `last seen ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `last seen ${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `last seen on ${lastSeenDate.toLocaleDateString()}`;
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate getting recipient's last seen status
  useEffect(() => {
    if (recipientUser) {
      // This would typically come from your backend
      const randomTime = new Date();
      randomTime.setMinutes(randomTime.getMinutes() - Math.floor(Math.random() * 120));
      setLastSeen(randomTime);
    }
  }, [recipientUser]);

  if (!recipientUser) return <p className="chat-empty">Select a conversation to start chatting</p>;
  if (isMessagesLoading) return <p className="chat-empty">Loading messages…</p>;

  return (
    <>
      <div className="chat-wrapper">
        <div className="chat-header">
          {/* Add this button, visible only on mobile */}
          <button className="menu-toggle-btn" onClick={onToggleContacts} aria-label="Toggle contacts">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="recipient-info">
            <div className="recipient-avatar">
              {recipientUser?.name?.[0]?.toUpperCase()}
              <span className={`status-indicator ${recipientUser?.isOnline ? 'online' : ''}`}></span>
            </div>
            <div className="recipient-details">
              <div className="recipient-name">{recipientUser?.name}</div>
              <div className="recipient-status">
                {recipientUser?.isOnline ? "Active now" : formatLastSeen(lastSeen)}
              </div>
            </div>
          </div>
          <div className="chat-actions">
            <button className="action-btn" title="Search in conversation">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <button className="action-btn" title="More options">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="chat-body">
          <div className="date-divider">Today</div>
          {messages?.map((m, i) => (
            <div key={i} className={`chat-message-container ${m.senderId === user?._id ? "self" : "other"}`}>
              <div ref={scroll} className="chat-message">
                <div className="chat-msg-text">{m.text}</div>
                <div className="chat-msg-info">
                  <div className="chat-msg-time">{new Intl.DateTimeFormat('en-GB', {hour:'2-digit',minute:'2-digit'}).format(new Date(m.createdAt))}</div>
                  {m.senderId === user?._id && (
                    <div className="message-status">
                      {m.read ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
        </div>
        
        <form className="chat-input-wrapper" onSubmit={e => sendtextmessage(e, textMessage, user, currentChat._id, setTextMessage)}>
          <button type="button" className="attachment-btn" title="Attach file">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>
          
          <div className="input-container">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="chat-input" 
              value={textMessage} 
              onChange={handleInputChange}
            />
            <button 
              type="button" 
              className="emoji-btn" 
              title="Add emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>
          </div>
          
          <button className="chat-send-btn" type="submit" disabled={!textMessage.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        
        {showEmojiPicker && (
          <div className="emoji-picker">
            <div className="emoji-grid">
              {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤏', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'].map((emoji, index) => (
                <button key={index} className="emoji-item" onClick={() => addEmoji(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .chat-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          position: relative;
        }
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .recipient-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }
        
        .recipient-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }
        
        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #d1d5db;
          border: 2px solid #fff;
        }
        
        .status-indicator.online {
          background-color: #10b981;
        }
        
        .recipient-details {
          display: flex;
          flex-direction: column;
        }
        
        .recipient-name {
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
        }
        
        .recipient-status {
          font-size: 13px;
          color: #6b7280;
        }
        
        .chat-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .action-btn:hover {
          background: #e5e7eb;
          color: #4f46e5;
        }

        /* Add this new style for the menu toggle button */
        .menu-toggle-btn {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 8px;
          margin-right: 8px;
          border-radius: 50%;
          display: none; /* Hidden by default */
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .menu-toggle-btn:hover {
          background-color: #e9ecef;
        }
        
        .chat-body {
          flex: 1;
          padding: 16px 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #f9fafb;
        }
        
        .date-divider {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin: 10px 0;
          position: relative;
        }
        
        .date-divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
          z-index: 1;
        }
        
        .date-divider span {
          background: #f9fafb;
          padding: 0 10px;
          position: relative;
          z-index: 2;
        }
        
        .chat-message-container {
          display: flex;
          margin-bottom: 12px;
        }
        
        .chat-message-container.self {
          justify-content: flex-end;
        }
        
        .chat-message {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 14px;
          word-break: break-word;
          position: relative;
        }
        
        .chat-message-container.self .chat-message {
          background: #4f46e5;
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        
        .chat-message-container.other .chat-message {
          background: #fff;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 4px;
        }
        
        .chat-msg-text {
          margin-bottom: 4px;
          line-height: 1.4;
        }
        
        .chat-msg-info {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          font-size: 11px;
          opacity: 0.7;
        }
        
        .chat-message-container.other .chat-msg-info {
          justify-content: flex-start;
        }
        
        .message-status {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: #fff;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          border: 1px solid #e5e7eb;
          width: fit-content;
          max-width: 70%;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #9ca3af;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .chat-input-wrapper {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #fff;
          border-top: 1px solid #e9ecef;
          gap: 8px;
        }
        
        .attachment-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .attachment-btn:hover {
          background: #f3f4f6;
          color: #4f46e5;
        }
        
        .input-container {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .chat-input {
          flex: 1;
          padding: 10px 40px 10px 14px;
          border-radius: 24px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          background: #f9fafb;
          transition: all 0.2s;
        }
        
        .chat-input:focus {
          border-color: #4f46e5;
          outline: none;
          background: #fff;
        }
        
        .emoji-btn {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }
        
        .chat-send-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .chat-send-btn:hover {
          background: #4338ca;
        }
        
        .chat-send-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        
        .emoji-picker {
          position: absolute;
          bottom: 70px;
          right: 20px;
          width: 300px;
          max-height: 300px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          z-index: 10;
        }
        
        .emoji-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 4px;
          padding: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .emoji-item {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          padding: 6px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .emoji-item:hover {
          background: #f3f4f6;
        }
        
        .chat-empty {
          padding: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }
        
        @media (max-width: 720px) {
          .chat-header {
            padding: 12px 16px;
          }
          
          .chat-body {
            padding: 12px 16px;
          }
          
          .chat-message {
            max-width: 85%;
          }
          
          .emoji-picker {
            width: 280px;
            right: 10px;
          }

          /* Show the menu toggle button on mobile */
          .menu-toggle-btn {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}