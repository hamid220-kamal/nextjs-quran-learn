
import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import Link from 'next/link';
import './Login.css';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Login — QuranLearn AI',
  description: 'Access your QuranLearn account to continue your Quranic journey. Track your progress, join study groups, and access personalized learning features.',
  robots: 'noindex, follow', // Don't index login pages
};

  const LoginPage: React.FC = () => {
    return (
      <>
        <Navbar />
        <main className="auth-page">
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-header">
                <h1>Welcome Back</h1>
                <p>Continue your Quranic learning journey</p>
              </div>
              
              <form className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope"></i>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="Enter your email" 
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="password-label-group">
                    <label htmlFor="password">Password</label>
                    <Link href="/reset-password" className="forgot-password">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-wrapper">
                    <i className="fas fa-lock"></i>
                    <input 
                      type="password" 
                      id="password" 
                      placeholder="Enter your password" 
                      required
                    />
                    <button type="button" className="toggle-password">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                
                <div className="form-group remember-me">
                  <label className="checkbox-label">
                    <input type="checkbox" id="remember" />
                    <span className="checkbox-custom"></span>
                    Remember me
                  </label>
                </div>
                
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
              </form>
              
              <div className="auth-divider">
                <span>OR</span>
              </div>
              
              <div className="social-auth">
                <button className="btn btn-social google">
                  <i className="fab fa-google"></i> Continue with Google
                </button>
                <button className="btn btn-social facebook">
                  <i className="fab fa-facebook-f"></i> Continue with Facebook
                </button>
                <button className="btn btn-social apple">
                  <i className="fab fa-apple"></i> Continue with Apple
                </button>
              </div>
              
              <div className="auth-footer">
                <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>
              </div>
            </div>
            
            <div className="auth-image">
              <div className="image-overlay"></div>
              <div className="quote-container">
                <blockquote>
                  "Whoever follows a path in pursuit of knowledge, Allah makes easy for them a path to Paradise."
                </blockquote>
                <cite>— Prophet Muhammad ﷺ</cite>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  };
  
  export default LoginPage;
