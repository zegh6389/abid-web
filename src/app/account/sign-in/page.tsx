'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export default function AuthRoute() {
  return <LoginPage />
}

function LoginPage() {
  const [isActive, setIsActive] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: replace with real auth
      await new Promise((r) => setTimeout(r, 800))
    } catch (err: any) {
      setError(err?.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: replace with real registration
      await new Promise((r) => setTimeout(r, 800))
      setIsActive(false)
    } catch (err: any) {
      setError(err?.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`login-page ${montserrat.className}`}>
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100 p-4 pt-24 md:pt-28">
        <div className={`login-container ${isActive ? 'active' : ''}`} id="container">
          {/* Sign Up Form */}
          <div className="form-container sign-up">
            <form onSubmit={handleSignUp} aria-label="Create Account">
              <h1>Create Account</h1>
              <div className="social-icons" aria-label="Sign up with social accounts">
                <a href="#" className="icon" aria-label="Sign up with Facebook" onClick={(e) => e.preventDefault()}>
                  {/* Facebook icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.03 3.66 9.2 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34v7.03C18.34 21.26 22 17.08 22 12.06Z"/></svg>
                </a>
                <a href="#" className="icon" aria-label="Sign up with Twitter" onClick={(e) => e.preventDefault()}>
                  {/* Twitter icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.92c-.77.34-1.6.57-2.47.67a4.28 4.28 0 0 0 1.88-2.37 8.56 8.56 0 0 1-2.71 1.04 4.27 4.27 0 0 0-7.28 3.9A12.11 12.11 0 0 1 3.15 4.67a4.26 4.26 0 0 0 1.32 5.7 4.22 4.22 0 0 1-1.93-.53v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.75.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.73 2.16 2.98 4.06 3.01A8.57 8.57 0 0 1 2 19.55 12.07 12.07 0 0 0 8.56 21.5c7.3 0 11.29-6.04 11.29-11.28l-.01-.51A8.06 8.06 0 0 0 22 5.92Z"/></svg>
                </a>
                <a href="#" className="icon" aria-label="Sign up with Github" onClick={(e) => e.preventDefault()}>
                  {/* GitHub icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.03-.02-1.86-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.33 1.11 2.9.85.09-.66.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.04-2.75-.1-.26-.45-1.3.1-2.7 0 0 .85-.28 2.77 1.05a9.33 9.33 0 0 1 5.05 0c1.92-1.33 2.77-1.05 2.77-1.05.55 1.41.2 2.45.1 2.7.65.72 1.04 1.63 1.04 2.75 0 3.95-2.34 4.81-4.57 5.06.36.32.68.95.68 1.93 0 1.4-.01 2.53-.01 2.87 0 .27.18.6.69.49A10.06 10.06 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" clipRule="evenodd"/></svg>
                </a>
              </div>
              <span>or use your email for registration</span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button disabled={loading} aria-busy={loading} type="submit">
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
              {error && (
                <div className="mt-4 text-center text-red-500 text-sm" role="alert">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Sign In Form */}
          <div className="form-container sign-in">
            <form onSubmit={handleSignIn} aria-label="Sign In">
              <h1>Sign In</h1>
              <div className="social-icons" aria-label="Sign in with social accounts">
                <a href="#" className="icon" aria-label="Sign in with Facebook" onClick={(e) => e.preventDefault()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.03 3.66 9.2 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34v7.03C18.34 21.26 22 17.08 22 12.06Z"/></svg>
                </a>
                <a href="#" className="icon" aria-label="Sign in with Twitter" onClick={(e) => e.preventDefault()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.92c-.77.34-1.6.57-2.47.67a4.28 4.28 0 0 0 1.88-2.37 8.56 8.56 0 0 1-2.71 1.04 4.27 4.27 0 0 0-7.28 3.9A12.11 12.11 0 0 1 3.15 4.67a4.26 4.26 0 0 0 1.32 5.7 4.22 4.22 0 0 1-1.93-.53v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.75.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.73 2.16 2.98 4.06 3.01A8.57 8.57 0 0 1 2 19.55 12.07 12.07 0 0 0 8.56 21.5c7.3 0 11.29-6.04 11.29-11.28l-.01-.51A8.06 8.06 0 0 0 22 5.92Z"/></svg>
                </a>
                <a href="#" className="icon" aria-label="Sign in with Github" onClick={(e) => e.preventDefault()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.03-.02-1.86-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.33 1.11 2.9.85.09-.66.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.04-2.75-.1-.26-.45-1.3.1-2.7 0 0 .85-.28 2.77 1.05a9.33 9.33 0 0 1 5.05 0c1.92-1.33 2.77-1.05 2.77-1.05.55 1.41.2 2.45.1 2.7.65.72 1.04 1.63 1.04 2.75 0 3.95-2.34 4.81-4.57 5.06.36.32.68.95.68 1.93 0 1.4-.01 2.53-.01 2.87 0 .27.18.6.69.49A10.06 10.06 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" clipRule="evenodd"/></svg>
                </a>
              </div>
              <span>or use your email and password</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link href="#" onClick={(e) => e.preventDefault()} className="forgot">
                Forget Your Password?
              </Link>
              <button disabled={loading} aria-busy={loading} type="submit">
                {loading ? 'Loading...' : 'Sign In'}
              </button>
              {error && (
                <div className="mt-4 text-center text-red-500 text-sm" role="alert">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Toggle Container */}
          <div className="toggle-container" aria-hidden="true">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of our features</p>
                <button id="login" type="button" onClick={() => setIsActive(false)}>
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of our features</p>
                <button id="register" type="button" onClick={() => setIsActive(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

  <style jsx global>{`
        /* Import Montserrat via next/font, so no @import needed */

        .login-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container{
          background-color: #fff;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }

        .login-container p{
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.3px;
          margin: 20px 0;
        }

        .login-container span{
          font-size: 12px;
        }

        .login-container a{
          color: #333;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0 10px;
        }

        .login-container a.forgot:hover {
          text-decoration: underline;
        }

        .login-container button{
          background: linear-gradient(135deg, rgb(var(--surface-cta-start)) 0%, rgb(var(--surface-cta-end)) 100%);
          color: #fff;
          font-size: 12px;
          padding: 10px 45px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .login-container button.hidden{
          background-color: transparent;
          border-color: #fff;
        }

        .login-container form{
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          height: 100%;
          text-align: center;
        }

        .login-container input{
          background-color: #eee;
          border: none;
          margin: 8px 0;
          padding: 10px 15px;
          font-size: 13px;
          border-radius: 8px;
          width: 100%;
          outline: none;
        }

        .form-container{
          position: absolute;
          top: 0;
          height: 100%;
          transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        /* Parallax effect for inner forms to emphasize sliding */
        .form-container form {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 1;
          transition: transform 0.6s ease, opacity 0.6s ease;
          will-change: transform, opacity;
        }

        .login-container:not(.active) .sign-up form {
          transform: translate3d(-16px, 0, 0) scale(0.985);
          opacity: 0.55;
        }
        .login-container.active .sign-in form {
          transform: translate3d(16px, 0, 0) scale(0.985);
          opacity: 0.55;
        }
        .login-container.active .sign-up form {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 1;
        }

        .sign-in{
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .login-container.active .sign-in{
          transform: translate3d(100%, 0, 0);
        }

        .sign-up{
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        .login-container.active .sign-up{
          transform: translate3d(100%, 0, 0);
          opacity: 1;
          z-index: 5;
          animation: move 0.6s;
          pointer-events: auto;
        }

        @keyframes move{
          0%, 49.99%{
            opacity: 0;
            z-index: 1;
          }
          50%, 100%{
            opacity: 1;
            z-index: 5;
          }
        }

        .social-icons{
          margin: 20px 0;
        }

        .social-icons a{
          border: 1px solid #ccc;
          border-radius: 20%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin: 0 3px;
          width: 40px;
          height: 40px;
          color: #333;
        }

        .toggle-container{
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.9s ease;
          border-radius: 150px 0 0 100px;
          z-index: 20; /* below header (z-50) so menus overlay correctly */
          will-change: transform;
          backface-visibility: hidden;
        }

        .login-container.active .toggle-container{
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }

        .toggle{
          height: 100%;
          background: linear-gradient(
            135deg,
            rgb(var(--surface-hero-start)) 0%,
            rgb(var(--surface-hero-mid)) 40%,
            rgb(var(--surface-hero-end)) 100%
          );
          background-size: 300% 300%;
          animation: gradient-shift 8s ease-in-out infinite;
          color: #fff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translate3d(0, 0, 0);
          transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
          will-change: transform;
          backface-visibility: hidden;
        }

        .login-container.active .toggle{
          transform: translate3d(50%, 0, 0);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.22);
        }

        .toggle-panel{
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          top: 0;
          transform: translate3d(0, 0, 0);
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
          backface-visibility: hidden;
        }

        .toggle-left{
          transform: translate3d(-200%, 0, 0);
        }

        .login-container.active .toggle-left{
          transform: translate3d(0, 0, 0);
        }

        .toggle-right{
          right: 0;
          transform: translate3d(0, 0, 0);
        }

        .login-container.active .toggle-right{
          transform: translate3d(200%, 0, 0);
        }

        /* Ensure buttons are visible and clickable */
        .toggle-panel button {
          background-color: transparent !important;
          border: 2px solid #fff !important;
          color: #fff !important;
          padding: 12px 45px !important;
          border-radius: 20px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase !important;
          margin-top: 15px !important;
          font-size: 14px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1) !important;
          display: block !important;
          visibility: visible !important;
        }

        .toggle-panel button.hidden {
          background-color: transparent !important;
          border: 2px solid #fff !important;
          color: #fff !important;
          display: block !important;
          visibility: visible !important;
        }

        .toggle-panel button:hover {
          background-color: #fff !important;
          color: #512da8 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3) !important;
        }

        .toggle-panel h1 {
          color: #fff !important;
          margin-bottom: 15px !important;
          font-size: 28px !important;
          font-weight: 700 !important;
        }

        .toggle-panel p {
          color: #fff !important;
          margin-bottom: 20px !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
      `}</style>
    </div>
  )
}
