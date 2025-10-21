import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import Link from 'next/link';
import './Signup.css';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Sign Up — QuranLearn AI',
  description: 'Create a QuranLearn account to begin your Quranic learning journey. Access personalized learning features, study groups, and track your progress.',
  robots: 'noindex, follow', // Don't index signup pages
};

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Create Your Account</h1>
              <p>Join thousands of learners on their Quranic journey</p>
            </div>
            
            <form className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user"></i>
                    <input 
                      type="text" 
                      id="firstName" 
                      placeholder="Enter your first name" 
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user"></i>
                    <input 
                      type="text" 
                      id="lastName" 
                      placeholder="Enter your last name" 
                      required
                    />
                  </div>
                </div>
              </div>
              
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
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="Create a password" 
                    required
                  />
                  <button type="button" className="toggle-password">
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
                <div className="password-strength">
                  <div className="strength-meter">
                    <div className="strength-segment medium"></div>
                  </div>
                  <span>Medium strength</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    placeholder="Confirm your password" 
                    required
                  />
                </div>
              </div>
              
              <div className="form-group terms-checkbox">
                <label className="checkbox-label">
                  <input type="checkbox" id="terms" required />
                  <span className="checkbox-custom"></span>
                  I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block">
                Create Account
              </button>
            </form>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="social-auth">
              <button className="btn btn-social google">
                <i className="fab fa-google"></i> Sign up with Google
              </button>
              <button className="btn btn-social facebook">
                <i className="fab fa-facebook-f"></i> Sign up with Facebook
              </button>
              <button className="btn btn-social apple">
                <i className="fab fa-apple"></i> Sign up with Apple
              </button>
            </div>
            
            <div className="auth-footer">
              <p>Already have an account? <Link href="/login">Login</Link></p>
            </div>
          </div>
          
          <div className="auth-image">
            <div className="image-overlay"></div>
            <div className="features-list">
              <h2>Start Your Quranic Journey</h2>
              <ul>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Personalized learning experience</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Interactive lessons and exercises</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Track your progress and achievements</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Join a global community of learners</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Access to expert guidance and resources</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}