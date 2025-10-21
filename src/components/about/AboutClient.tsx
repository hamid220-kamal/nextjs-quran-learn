// components/about/AboutClient.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../../app/about/About.css';

const AboutClient = () => {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "AI-Powered Learning",
      description: "Personalized recitation feedback with advanced AI that adapts to your learning pace and corrects pronunciation in real-time.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Tajweed Mastery",
      description: "Interactive modules for perfect pronunciation with voice recognition technology.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Multi-Language Support",
      description: "Learn in your preferred language with translations in 25+ languages worldwide.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Community Learning",
      description: "Join a global community of learners and share your progress with fellow Muslims.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      id: 1,
      content: "This Quran app has completely transformed my daily spiritual practice. The beautiful interface makes it a joy to use.",
      author: "Aisha Khan",
      role: "Student",
      rating: 5,
      emoji: "🙏"
    },
    {
      id: 2,
      content: "The AI feedback helped me correct my Tajweed effectively. Perfect for serious learners.",
      author: "Mohammed Ali",
      role: "Teacher",
      rating: 5,
      emoji: "🌟"
    },
    {
      id: 3,
      content: "Great for family learning. My children love the interactive features.",
      author: "Fatima Ahmed",
      role: "Parent",
      rating: 5,
      emoji: "💫"
    }
  ];

  const faqs = [
    {
      question: "What makes this app different from others?",
      answer: "Our app combines cutting-edge AI technology with traditional Islamic learning methods, offering real-time Tajweed correction and personalized learning paths."
    },
    {
      question: "Does it work offline?",
      answer: "Yes! Once you download the Quran text and translations, you can access them anytime, anywhere without internet connection."
    },
    {
      question: "Is it available in multiple languages?",
      answer: "Yes! We support 25+ languages including Arabic, English, Urdu, Turkish, and many more. All translations are verified by scholars."
    }
  ];

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting && element.dataset.section) {
            setVisibleSections(prev => ({
              ...prev,
              [element.dataset.section]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-section]').forEach(el => {
      observer.observe(el);
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`quran-app ${darkMode ? 'dark-mode' : ''}`} ref={containerRef}>
      {/* Quran Pattern Background */}
      <div className={`quran-pattern-overlay ${darkMode ? 'dark' : ''}`}>
        <div className="pattern-bg"></div>
      </div>

      {/* Hero Section */}
      <section className="hero" data-section="hero">
        <div className="hero-content">
          <div className="app-icon">
            <div className="icon-rotate">
              <svg className="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="floating-dot" />
            ))}
          </div>

          <h1 className="hero-title">
            QuranLearn AI
            <span className="sparkle">✨</span>
          </h1>

          <p className="hero-subtitle">
            Experience the <span className="highlight">Holy Quran</span> like never before with our 
            <span className="highlight"> AI-powered</span> learning platform
          </p>

          <div className="tags-container">
            {['🤖 AI-Powered', '📱 Offline Ready', '🌍 25+ Languages', '👨‍👩‍👧‍👦 All Ages'].map((tag, index) => (
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

          <button 
            className="cta-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="button-hover-bg"></div>
            <div className="button-shine"></div>
            <span className="button-content">
              <span className="button-emoji">{darkMode ? '☀️' : '🌙'}</span>
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </span>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" data-section="features">
        <div className="section-container">
          <h2 className="section-title">
            Amazing <span className="section-title-highlight">Features</span>
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`feature-card ${darkMode ? 'dark' : ''}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="feature-hover-bg"></div>
                {hoveredFeature === index && (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="feature-particle" />
                  ))
                )}
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" data-section="testimonials">
        <div className="section-container">
          <h2 className="section-title">
            What Users <span className="section-title-highlight">Say</span>
          </h2>
          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${darkMode ? 'dark' : ''} ${
                  index === activeTestimonial ? 'active' : 'hidden'
                }`}
              >
                <div className="testimonial-bg"></div>
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
      <section className="faq-section" data-section="faq">
        <div className="section-container">
          <h2 className="section-title">
            Frequently Asked <span className="section-title-highlight">Questions</span>
          </h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${darkMode ? 'dark' : ''}`}
              >
                <button
                  className={`faq-question ${darkMode ? 'dark' : ''}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}
                  <span className={`faq-chevron ${openFaq === index ? 'rotated' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {openFaq === index && (
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
          <h2 className="cta-title">
            Start Your Spiritual <span className="cta-title-highlight">Journey</span>
          </h2>
          <p className="cta-subtitle">
            Join thousands of Muslims worldwide in their Quran learning journey
          </p>
          <button className="cta-button-primary">
            <div className="cta-button-shine"></div>
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutClient;