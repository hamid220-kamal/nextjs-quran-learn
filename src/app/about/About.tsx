// app/about/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import './About.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  rating: number;
  emoji: string;
}

const AboutPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "This Quran app has completely transformed my daily spiritual practice. The beautiful interface and smooth navigation make it a joy to use every day.",
      author: "Aisha Khan",
      role: "Regular User",
      rating: 5,
      emoji: "🙏"
    },
    {
      id: 2,
      content: "As someone who's tried many Quran apps, this one stands out for its attention to detail and user experience. The dark mode is perfect for night reading.",
      author: "Mohammed Ali",
      role: "Islamic Student",
      rating: 5,
      emoji: "🌟"
    },
    {
      id: 3,
      content: "The audio recitations are crystal clear and the translations are accurate. This app has become an essential part of my daily routine.",
      author: "Fatima Ahmed",
      role: "Teacher",
      rating: 5,
      emoji: "💫"
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What makes this Quran app different from others?",
      answer: "Our app combines modern design with traditional Islamic aesthetics, offering features like real-time progress tracking, multiple translations, beautiful audio recitations, and an intuitive user interface that makes reading and understanding the Quran accessible to everyone."
    },
    {
      question: "Is the app available in multiple languages?",
      answer: "Yes! We support multiple languages including English, Arabic, Urdu, French, Spanish, and more. Our translations are carefully selected from reputable sources to ensure accuracy and clarity."
    },
    {
      question: "Can I use the app offline?",
      answer: "Absolutely! Once you download the Quran text and your preferred translations, you can access them anytime, anywhere without an internet connection. Audio recitations require internet access unless downloaded in advance."
    },
    {
      question: "How often is the app updated?",
      answer: "We regularly update the app with new features, improvements, and content. Our team is committed to providing the best possible experience and we welcome user feedback for continuous improvement."
    },
    {
      question: "Is the app completely free to use?",
      answer: "Yes, our core features are completely free. We believe that access to the Quran should be available to everyone without barriers. Optional premium features may be introduced in the future, but the essential reading and listening features will always remain free."
    }
  ];

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`quran-app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Quran Pattern Background */}
      <div className={`quran-pattern-overlay ${darkMode ? 'dark' : ''}`}>
        <div className="pattern-bg"></div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          {/* App Icon */}
          <div className="app-icon icon-rotate">
            <svg className="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="floating-dot"></div>
            ))}
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Quranic Verses
            <span className="sparkle">✨</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Experience the <span className="highlight">Holy Quran</span> like never before with our beautifully designed digital platform. 
            Read, listen, and reflect with <span className="highlight">elegant typography</span>, 
            <span className="highlight"> crystal clear audio</span>, and 
            <span className="highlight"> intuitive features</span>.
          </p>

          {/* Tags */}
          <div className="tags-container">
            {['Beautiful Design', 'Multiple Translations', 'Audio Recitations', 'Progress Tracking', 'Dark Mode', 'Offline Access'].map((tag, index) => (
              <div 
                key={tag} 
                className={`tag ${darkMode ? 'dark' : ''}`}
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="tag-hover-effect"></div>
                {tag}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="cta-button" onClick={toggleDarkMode}>
            <div className="button-hover-bg"></div>
            <div className="button-shine"></div>
            <span className="button-content">
              <span className="button-emoji">🌙</span>
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </span>
          </button>

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <span className="scroll-text">Explore Features</span>
            <div className="chevron-animation">
              <svg className="chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Amazing <span className="section-title-highlight">Features</span>
            </h2>
            <p className="section-subtitle">
              Designed with care and attention to detail, our features enhance your Quran reading experience
            </p>
            <div className="title-underline-container">
              <div className="title-underline"></div>
            </div>
          </div>

          <div className="features-grid">
            {[
              {
                icon: (
                  <svg className="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                ),
                title: "Beautiful Design",
                description: "Experience the Quran with elegant Arabic typography and modern, clean design that enhances readability and focus."
              },
              {
                icon: (
                  <svg className="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                ),
                title: "Crystal Clear Audio",
                description: "Listen to beautiful recitations from renowned Qaris with multiple audio quality options and playback controls."
              },
              {
                icon: (
                  <svg className="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                ),
                title: "Multiple Translations",
                description: "Access translations in multiple languages with the ability to compare different interpretations and tafsirs."
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={`feature-card ${darkMode ? 'dark' : ''}`}
                style={{ animationDelay: `${0.3 + index * 0.2}s` }}
              >
                <div className="feature-hover-bg" style={{ background: `linear-gradient(135deg, ${['#10b981', '#3b82f6', '#8b5cf6'][index]}, transparent)` }}></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="feature-particle"></div>
                ))}
                <div 
                  className="feature-icon"
                  style={{ background: `linear-gradient(135deg, ${['#10b981', '#3b82f6', '#8b5cf6'][index]}, ${['#0d9488', '#2563eb', '#7c3aed'][index]})` }}
                >
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Our <span className="section-title-highlight">Mission & Vision</span>
            </h2>
            <p className="section-subtitle">
              Guided by faith and innovation, we strive to make the Quran accessible to everyone
            </p>
            <div className="title-underline-container">
              <div className="title-underline"></div>
            </div>
          </div>

          <div className="mission-grid">
            {/* Mission Card */}
            <div className={`mission-card ${darkMode ? 'dark' : ''}`}>
              <div className="mission-floating-1"></div>
              <div className="mission-floating-2"></div>
              <div className="mission-icon">
                <svg className="mission-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="mission-title">
                Our <span className="mission-highlight">Mission</span>
              </h3>
              <p className="mission-description">
                To provide a beautiful, accessible, and authentic digital Quran experience that helps Muslims worldwide 
                connect with the Holy Quran through modern technology while preserving its sacred nature and traditional values.
              </p>
            </div>

            {/* Vision Card */}
            <div className={`vision-card ${darkMode ? 'dark' : ''}`}>
              <div className="vision-floating-1"></div>
              <div className="vision-floating-2"></div>
              <div className="vision-icon">
                <svg className="vision-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="vision-title">
                Our <span className="vision-highlight">Vision</span>
              </h3>
              <p className="vision-description">
                To become the most trusted and loved digital Quran platform worldwide, empowering millions of Muslims 
                to read, understand, and live by the teachings of the Quran through innovative technology and thoughtful design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              What Users <span className="section-title-highlight">Say</span>
            </h2>
            <p className="section-subtitle">
              Join thousands of satisfied users who have transformed their Quran reading experience
            </p>
            <div className="title-underline-container">
              <div className="title-underline"></div>
            </div>
          </div>

          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${darkMode ? 'dark' : ''} ${
                  index === activeTestimonial ? 'active' : 'hidden'
                }`}
              >
                <div className="testimonial-bg"></div>
                <div className="testimonial-hover-effect"></div>
                <div className="testimonial-avatar">{testimonial.emoji}</div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-name">{testimonial.author}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="star-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Frequently Asked <span className="section-title-highlight">Questions</span>
            </h2>
            <p className="section-subtitle">
              Find answers to common questions about our Quran app
            </p>
            <div className="title-underline-container">
              <div className="title-underline"></div>
            </div>
          </div>

          <div className="faq-container">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${darkMode ? 'dark' : ''}`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <button
                  className={`faq-question ${darkMode ? 'dark' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="faq-question-content">
                    <span className="faq-arrow">
                      <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                    {faq.question}
                  </span>
                  <span className={`faq-chevron ${openFAQ === index ? 'rotated' : ''}`}>
                    <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {openFAQ === index && (
                  <div className={`faq-answer ${darkMode ? 'dark' : ''}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-header">
            <h2 className="cta-title">
              Start Your Spiritual <span className="cta-title-highlight">Journey</span>
            </h2>
            <p className="cta-subtitle">
              Download the app now and experience the Quran in a whole new way
            </p>
          </div>

          <div className="cta-buttons">
            <button className="cta-button-primary">
              <div className="cta-button-shine"></div>
              <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Now
            </button>

            <button className={`cta-button-secondary ${darkMode ? 'dark' : ''}`}>
              <svg className="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Demo
            </button>
          </div>

          <div className="cta-features">
            {['Free Forever', 'No Ads', 'Privacy Focused'].map((feature, index) => (
              <div key={feature} className="cta-feature">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;