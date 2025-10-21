
import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import './Tajweed.css';
import Footer from '../../components/Footer';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Learn Tajweed (Quranic Recitation) — QuranLearn AI',
  description: 'Master the art of Quranic recitation with our interactive Tajweed courses. Real-time audio analysis, personalized feedback, and comprehensive lessons for all levels.',
  keywords: 'tajweed, quranic recitation, learn tajweed, tajweed rules, quran pronunciation, tajweed course online',
  openGraph: {
    title: 'Learn Tajweed (Quranic Recitation) — QuranLearn AI',
    description: 'Interactive Tajweed learning with AI-powered pronunciation analysis',
    type: 'website',
    images: [
      {
        url: '/tajweed-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QuranLearn AI - Tajweed Learning'
      }
    ]
  }
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="tajweed-page">
        <section className="tajweed-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Master the Art of Quranic Recitation</h1>
            <p className="lead">Learn Tajweed with our interactive platform and perfect your Quran pronunciation</p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Start Free Lesson</button>
              <button className="btn btn-secondary">Take Assessment</button>
            </div>
          </div>
        </section>

        <section className="tajweed-intro">
          <div className="container">
            <div className="intro-content">
              <h2>What is <span>Tajweed</span>?</h2>
              <p>Tajweed is the set of rules governing pronunciation during recitation of the Quran. The term comes from the Arabic root ج-و-د (j-w-d) meaning "to make better" or "to improve."</p>
              <p>The goal of tajweed is to ensure the proper articulation of every letter, with all its qualities, and to observe the rules that apply to those letters in different situations.</p>
              <p>By learning tajweed, you'll be able to recite the Quran as it was revealed to Prophet Muhammad ﷺ, preserving its beauty and meaning.</p>
              <button className="btn btn-outline">Learn More About Tajweed</button>
            </div>
            <div className="intro-image">
              <img src="/tajweed-quran-page.jpg" alt="Quran page with Tajweed markings" />
            </div>
          </div>
        </section>

        <section className="tajweed-features">
          <div className="container">
            <h2 className="section-title">Our Approach to Teaching Tajweed</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-microphone-alt"></i>
                </div>
                <h3>Real-time Voice Analysis</h3>
                <p>Our AI technology analyzes your recitation in real-time, identifying errors and providing immediate feedback.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <h3>Expert-Led Lessons</h3>
                <p>Learn from qualified Quran teachers with ijazah (certification) in Quranic recitation.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Progress Tracking</h3>
                <p>Track your improvement over time with detailed analytics and personalized dashboards.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-book-reader"></i>
                </div>
                <h3>Comprehensive Curriculum</h3>
                <p>Structured lessons covering all aspects of tajweed from basic makharij to advanced rules.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tajweed-rules">
          <div className="container">
            <h2 className="section-title">Essential Tajweed Rules</h2>
            <div className="rules-tabs">
              <button className="tab active">Makharij (Articulation Points)</button>
              <button className="tab">Sifaat (Characteristics)</button>
              <button className="tab">Noon & Meem Rules</button>
              <button className="tab">Madd (Prolongation)</button>
              <button className="tab">Waqf (Stopping)</button>
            </div>
            <div className="rule-content">
              <div className="rule-text">
                <h3>Makharij (Articulation Points)</h3>
                <p>Makharij are the points of articulation where the letters of the Arabic alphabet originate from. There are 17 main articulation points grouped into five general areas:</p>
                <ul>
                  <li>Al-Jawf (the empty space in the mouth and throat): For elongation letters (alif, waw, ya)</li>
                  <li>Al-Halq (the throat): For letters like ه ,ح ,ع ,غ ,خ ,ء</li>
                  <li>Al-Lisaan (the tongue): For letters like ل ,ن ,ر ,د ,ت ,ط</li>
                  <li>Ash-Shafataan (the lips): For letters like ف ,و ,ب ,م</li>
                  <li>Al-Khayshoom (the nasal passage): For ghunnah (nasalization)</li>
                </ul>
                <p>Proper pronunciation begins with identifying the exact point where each letter should be articulated.</p>
              </div>
              <div className="rule-visual">
                <img src="/makharij-diagram.jpg" alt="Diagram showing points of articulation" />
                <div className="legend">
                  <span className="legend-item"><span className="color-dot halq"></span> Throat (Al-Halq)</span>
                  <span className="legend-item"><span className="color-dot lisan"></span> Tongue (Al-Lisaan)</span>
                  <span className="legend-item"><span className="color-dot shafatan"></span> Lips (Ash-Shafataan)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tajweed-levels">
          <div className="container">
            <h2 className="section-title">Learning Path</h2>
            <p className="section-subtitle">Progress through structured levels to master Tajweed</p>
            
            <div className="levels-timeline">
              <div className="level">
                <div className="level-icon">1</div>
                <div className="level-content">
                  <h3>Beginner</h3>
                  <p>Learn Arabic alphabet, basic pronunciation, and introductory concepts of Tajweed.</p>
                  <ul>
                    <li>Letter recognition and pronunciation</li>
                    <li>Basic vowel sounds (harakaat)</li>
                    <li>Simple word formation</li>
                  </ul>
                </div>
              </div>
              
              <div className="level">
                <div className="level-icon">2</div>
                <div className="level-content">
                  <h3>Elementary</h3>
                  <p>Focus on articulation points and basic Tajweed rules for clear recitation.</p>
                  <ul>
                    <li>Makharij (articulation points)</li>
                    <li>Basic sifaat (letter characteristics)</li>
                    <li>Simple rules for noon saakinah and tanween</li>
                  </ul>
                </div>
              </div>
              
              <div className="level">
                <div className="level-icon">3</div>
                <div className="level-content">
                  <h3>Intermediate</h3>
                  <p>Advance to more complex rules and begin fluid recitation of short surahs.</p>
                  <ul>
                    <li>Rules of madd (prolongation)</li>
                    <li>Rules for meem saakinah</li>
                    <li>Waqf (stopping) and ibtidaa' (starting)</li>
                  </ul>
                </div>
              </div>
              
              <div className="level">
                <div className="level-icon">4</div>
                <div className="level-content">
                  <h3>Advanced</h3>
                  <p>Master complex rules and perfect your recitation with proper melody.</p>
                  <ul>
                    <li>Advanced madd rules</li>
                    <li>Special rules for specific letters</li>
                    <li>Introduction to qiraat (styles of recitation)</li>
                    <li>Proper melody and tone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}