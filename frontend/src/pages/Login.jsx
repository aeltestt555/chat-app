import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const {
    updateLoginInfo,
    loginError,
    loginInfo,
    isLoginLoading,
    loginUser,
  } = useContext(AuthContext);

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">We're so excited to see you again!</p>

          <form onSubmit={loginUser} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="auth-input"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="auth-input"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
                required
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                Remember me
                <input type="checkbox" />
                <span className="checkmark"></span>
              </label>
              <a href="#!" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoginLoading}>
              {isLoginLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {loginError?.error && (
            <div className="auth-error">{loginError.message}</div>
          )}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-wrapper {
          min-height: calc(100vh - 60px); /* Adjust for navbar height */
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        .auth-card {
          background: #fff;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #212529;
        }
        .auth-sub {
          margin-top: 4px;
          margin-bottom: 28px;
          color: #6c757d;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .input-group label {
          font-size: 14px;
          font-weight: 500;
          color: #495057;
        }
        .auth-input {
          padding: 14px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: #4f46e5;
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 400;
          color: #495057;
        }
        .checkbox-container input {
          display: none;
        }
        .checkmark {
          width: 16px;
          height: 16px;
          background-color: #fff;
          border: 1px solid #ced4da;
          border-radius: 4px;
          margin-right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .checkbox-container input:checked ~ .checkmark {
          background-color: #4f46e5;
          border-color: #4f46e5;
        }
        .checkbox-container input:checked ~ .checkmark::after {
          content: '✓';
          color: white;
          font-size: 12px;
        }
        .forgot-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }
        .auth-btn {
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-size: 16px;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 10px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-error {
          margin-top: 20px;
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          text-align: center;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: #adb5bd;
          font-size: 14px;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e9ecef;
        }
        .auth-divider span {
          padding: 0 16px;
        }
        .social-login {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          background: #fff;
          font-size: 15px;
          color: #495057;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .social-btn:hover {
          background-color: #f8f9fa;
        }
        .auth-switch {
          margin-top: 24px;
          font-size: 14px;
          color: #6c757d;
        }
        .auth-switch a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-switch a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}