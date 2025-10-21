// components/Navbar/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  
  const pathname = usePathname();
  const featuresRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setIsFeaturesOpen(false);
      }
      if (audioRef.current && !audioRef.current.contains(event.target as Node)) {
        setIsAudioOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsFeaturesOpen(false);
    setIsAudioOpen(false);
  };

  const toggleFeatures = () => {
    setIsFeaturesOpen(!isFeaturesOpen);
    if (isAudioOpen) setIsAudioOpen(false);
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioOpen(!isAudioOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link href="/" onClick={closeMenu}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2787/2787958.png" 
              alt="Quran Learning Logo" 
              className="logo"
              width={40}
              height={40}
            />
            <div className="logo-text">
              <span className="logo-main">QuranicLearn</span>
              <span className="logo-urdu">قرآنی سیکھیں</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            href="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fas fa-home"></i> Home
          </Link>
          
          <Link 
            href="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fas fa-star"></i> About Us 
          </Link>
          
          <Link 
            href="/quran" 
            className={`nav-link ${isActive('/quran') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fas fa-quran"></i> Quran
          </Link>
          
          <Link 
            href="/courses" 
            className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <i className="fas fa-book"></i> Courses
          </Link>
          
          {/* More Features Dropdown */}
          <div className="nav-dropdown" ref={featuresRef}>
            <button 
              className={`nav-link dropdown-toggle ${isFeaturesOpen ? 'active' : ''}`}
              onClick={toggleFeatures}
              aria-expanded={isFeaturesOpen}
            >
              <i className="fas fa-chevron-down"></i> More Features
            </button>
            
            <div className={`dropdown-menu ${isFeaturesOpen ? 'active' : ''}`}>
              <Link href="/hifz" className="dropdown-item" onClick={closeMenu}>
                <i className="fas fa-book-open"></i> HIFZ
              </Link>
              <Link href="/tafsir" className="dropdown-item" onClick={closeMenu}>
                <i className="fas fa-graduation-cap"></i> TAFSIR
              </Link>
              <Link href="/tajweed" className="dropdown-item" onClick={closeMenu}>
                <i className="fas fa-microphone"></i> TAJWEED
              </Link>
              <Link href="/prayer-time" className="dropdown-item" onClick={closeMenu}>
                <i className="fas fa-clock"></i> Prayer Time
              </Link>
              <Link href="/community" className="dropdown-item" onClick={closeMenu}>
                <i className="fas fa-users"></i> COMMUNITY
              </Link>
              
              {/* Nested Audio Dropdown */}
              <div className="nav-dropdown nested" ref={audioRef}>
                <button 
                  className={`dropdown-item dropdown-toggle ${isAudioOpen ? 'active' : ''}`}
                  onClick={toggleAudio}
                  aria-expanded={isAudioOpen}
                >
                  <i className="fas fa-music"></i> Audio ▸
                </button>
                <div className={`dropdown-menu nested ${isAudioOpen ? 'active' : ''}`}>
                  <Link href="/audio-quran" className="dropdown-item" onClick={closeMenu}>
                    Al-Quran
                  </Link>
                  <Link href="/seerah-audio" className="dropdown-item" onClick={closeMenu}>
                    Seerah
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Auth Buttons - Desktop */}
        <div className="navbar-auth">
          <Link href="/login" className="btn btn-login">
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
          <Link href="/signup" className="btn btn-signup">
            <i className="fas fa-user-plus"></i> Sign Up
          </Link>
        </div>

        {/* Auth Buttons - Mobile */}
        <div className="navbar-auth-mobile">
          <Link href="/login" className="btn btn-login">Login</Link>
          <Link href="/signup" className="btn btn-signup">Sign Up</Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
}