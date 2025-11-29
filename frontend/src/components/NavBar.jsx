import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';

export default function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">
          <span>Chat</span>App
        </Link>
        <div className="nav-links">
          {!user && (
            <>
              <Link to="/login" className="link">Login</Link>
              <Link to="/register" className="link">Register</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/chat" className="icon-link" title="Chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </Link>
              <div className="user-info">
                <span className="username">Hi, {user.name}</span>
              </div>
              <button onClick={logoutUser} className="logout-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
              <Notification />
            </>
          )}
        </div>
      </nav>
      <Outlet />

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .brand {
          font-weight: 700;
          font-size: 24px;
          color: #4f46e5;
          text-decoration: none;
          transition: color 0.2s;
        }
        .brand span {
          color: #212529;
        }
        .brand:hover {
          color: #764ba2;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .link {
          text-decoration: none;
          color: #495057;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background-color 0.2s, color 0.2s;
        }
        .link:hover {
          background-color: #f8f9fa;
          color: #4f46e5;
        }
        .icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          text-decoration: none;
          color: #495057;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        .icon-link:hover {
          background-color: #f8f9fa;
          color: #4f46e5;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .username {
          font-weight: 500;
          color: #212529;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: #dc3545;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .logout-btn:hover {
          background: #c82333;
        }

        @media (max-width: 720px){
          .nav-links { gap: 10px; }
          .brand { font-size: 20px; }
          .username { display: none; }
          .logout-btn span { display: none; }
        }
      `}</style>
    </>
  );
}