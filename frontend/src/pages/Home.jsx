import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="home-hero">
        <div className="home-card">
          <h1>Connect Instantly</h1>
          <p>Experience real-time messaging with a clean, modern interface designed for seamless conversations.</p>
          <div className="features">
            <div className="feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Real-time messaging
            </div>
            <div className="feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Smart notifications
            </div>
            <div className="feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Mobile-first design
            </div>
          </div>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">Get Started</Link>
            <Link to="/login" className="cta-btn secondary">Log In</Link>
          </div>
        </div>
      </div>

      <style>{`
        .home-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          min-height: calc(100vh - 60px); /* Adjust for navbar height */
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .home-card {
          max-width: 600px;
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          text-align: center;
        }
        .home-card h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #212529;
        }
        .home-card p {
          font-size: 18px;
          color: #495057;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .features {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border-radius: 12px;
          background: #f8f9fa;
          font-size: 14px;
          font-weight: 500;
          color: #495057;
          flex: 1;
          min-width: 120px;
        }
        .feature svg {
          color: #4f46e5;
        }
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .cta-btn {
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .cta-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
        }
        .cta-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
        }
        .cta-btn.secondary {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }
        .cta-btn.secondary:hover {
          background: #e9ecef;
        }

        @media (max-width: 720px) {
          .home-card { padding: 30px 20px; }
          .home-card h1 { font-size: 28px; }
          .home-card p { font-size: 16px; }
          .features { flex-direction: column; gap: 12px; }
          .cta-buttons { flex-direction: column; }
          .cta-btn { width: 100%; }
        }
      `}</style>
    </>
  );
}