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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        {/* Mobile Menu Toggle */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

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
        <div id="mobile-nav" className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* Mobile menu header with logo and close button */}
          <div className="menu-header">
            <div className="menu-logo">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2787/2787958.png"
                alt="Quran Learning Logo"
                className="logo menu-logo-image"
                width={34}
                height={34}
              />
              <div className="logo-text">
                <span className="logo-main">QuranicLearn</span>
                <span className="logo-urdu">قرآنی سیکھیں</span>
              </div>
            </div>
            <button className="menu-close" onClick={closeMenu} aria-label="Close menu">✕</button>
          </div>

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
              <i className="fas fa-th-large"></i>
              More Features
              <i className={`fas ${isFeaturesOpen ? 'fa-caret-up' : 'fa-caret-down'}`} style={{ marginLeft: 'auto' }} aria-hidden />
            </button>
            <div className={`dropdown-menu ${isFeaturesOpen ? 'active' : ''}`}>
              <Link href="/duas" className="dropdown-item" onClick={closeMenu}>
                <i className="fas fa-pray"></i> DUAS
              </Link>
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

              <Link href="/quran-player" className="dropdown-item" onClick={closeMenu}>
                <i className="fas fa-play-circle"></i> Quran Player
              </Link>

              {/* Nested Audio Dropdown */}
              <div className="nav-dropdown nested" ref={audioRef}>
                <button 
                  className={`dropdown-item dropdown-toggle ${isAudioOpen ? 'active' : ''}`}
                  onClick={toggleAudio}
                  aria-expanded={isAudioOpen}
                >
                  <i className="fas fa-music"></i>
                  Audio
                  <i className={`fas ${isAudioOpen ? 'fa-caret-up' : 'fa-caret-right'}`} style={{ marginLeft: 'auto' }} aria-hidden />
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

          {/* Auth Buttons - Mobile (Inside Menu) */}
          <div className="navbar-auth-mobile-menu">
            <Link href="/login" className="btn btn-login" onClick={closeMenu}>
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
            <Link href="/signup" className="btn btn-signup" onClick={closeMenu}>
              <i className="fas fa-user-plus"></i> Sign Up
            </Link>
          </div>
        </div>
        
        {/* Auth Buttons - Desktop */}
        <div className="navbar-auth-desktop">
          <Link href="/login" className="btn btn-login">
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
          <Link href="/signup" className="btn btn-signup">
            <i className="fas fa-user-plus"></i> Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}