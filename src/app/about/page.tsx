
import React from 'react';
import { Metadata } from 'next';
import './About.css';
import Navbar from '../../components/Navbar/Navbar';
import AboutClient from '../../components/about/AboutClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'About — QuranLearn AI',
  description: 'Experience the Quran like never before with AI-powered learning, real-time Tajweed correction, and personalized feedback. Available in 25+ languages with offline access.',
  keywords: 'Quran app, Islamic learning, Tajweed, AI Quran teacher, Islamic education, Quran translations',
  openGraph: {
    title: 'About — QuranLearn AI',
    description: 'AI-powered Quran learning with real-time Tajweed feedback and 25+ language support',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'QuranLearn AI - Modern Quranic Education'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuranLearn AI - Modern Quranic Education',
    description: 'AI-powered Quran learning platform with real-time feedback',
    images: ['/twitter-image.jpg']
  }
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      {/* SEO-friendly content for crawlers */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h1>QuranLearn AI - Modern Quranic Education Platform</h1>
        <p>
          Experience the Quran like never before with our AI-powered learning platform.
          Features include real-time Tajweed correction, multiple translations in 25+ languages,
          offline access, and personalized learning paths.
        </p>
        <h2>Key Features</h2>
        <ul>
          <li>AI-Powered Learning with real-time feedback</li>
          <li>Tajweed Mastery through voice recognition</li>
          <li>Multi-Language Support (25+ languages)</li>
          <li>Community Learning and Progress Tracking</li>
          <li>Gamified Experience with rewards</li>
          <li>Offline Access for uninterrupted learning</li>
        </ul>
        <h2>Testimonials</h2>
        <p>"This app transformed my Quran learning journey." - Ahmed R., Student</p>
        <p>"The AI feedback helped me correct my Tajweed effectively." - Fatima S., Teacher</p>
        <p>"Perfect for family learning." - Yusuf M., Parent</p>
      </div>
      {/* Interactive client component */}
      <AboutClient />
    </>
  );
}