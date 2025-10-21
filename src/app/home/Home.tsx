'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Home.css';

export default function QuranicLearnHome() {
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const verseInterval = setInterval(() => {
      setCurrentVerse(prev => (prev + 1) % verses.length);
    }, 8000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => {
      clearInterval(verseInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const verses = [
    {
      arabic: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ",
      translation: "And remind, for indeed, the reminder benefits the believers.",
      reference: "Quran 51:55"
    },
    {
      arabic: "وَقُرْآنًا فَرَقْنَاهُ لِتَقْرَأَهُ عَلَى النَّاسِ عَلَىٰ مُكْثٍ",
      translation: "And [it is] a Qur'an which We have separated [by intervals] that you might recite it to the people over a prolonged period.",
      reference: "Quran 17:106"
    },
    {
      arabic: "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ",
      translation: "Indeed, this Qur'an guides to that which is most suitable.",
      reference: "Quran 17:9"
    }
  ];

  const features = [
    {
      icon: "📖",
      title: "Interactive Learning",
      description: "Engage with the Quran through interactive lessons, audio recitations, and visual learning tools designed for all skill levels.",
      color: "emerald"
    },
    {
      icon: "▶️",
      title: "Audio Recitations",
      description: "Listen to beautiful recitations by renowned Qaris with synchronized text highlighting and pronunciation guides.",
      color: "blue"
    },
    {
      icon: "🌍",
      title: "Multiple Languages",
      description: "Access translations and explanations in over 25 languages to deepen your understanding of the Quranic text.",
      color: "purple"
    },
    {
      icon: "🏆",
      title: "Progress Tracking",
      description: "Track your learning journey with detailed progress reports, achievement badges, and personalized study plans.",
      color: "amber"
    }
  ];

  const testimonials = [
    {
      name: "Ahmad Rahman",
      role: "Student",
      location: "Malaysia",
      text: "This platform has transformed my relationship with the Quran. The interactive features make learning engaging and meaningful.",
      rating: 5
    },
    {
      name: "Fatima Al-Zahra",
      role: "Teacher",
      location: "Egypt",
      text: "As an Islamic studies teacher, I recommend this to all my students. The quality of content and user experience is exceptional.",
      rating: 5
    },
    {
      name: "Omar Hassan",
      role: "Engineer",
      location: "UAE",
      text: "The audio recitations with synchronized text have helped me improve my pronunciation significantly. Truly beneficial.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Learners", icon: "👥" },
    { number: "114", label: "Complete Surahs", icon: "📖" },
    { number: "25+", label: "Languages", icon: "🌍" },
    { number: "99%", label: "Satisfaction", icon: "⭐" }
  ];

  return (
    <div className="quran-app">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="floating-element floating-1"></div>
          <div className="floating-element floating-2"></div>
          <div className="floating-element floating-3"></div>
        </div>

        <div className="hero-content">
          <div className={`bismillah ${isVisible ? 'animate-in' : ''}`}>
            <div className="bismillah-box">
              <span className="arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            </div>
          </div>

          <div className={`hero-title ${isVisible ? 'animate-in delay-300' : ''}`}>
            <h1>
              <span className="title-line">Learn the</span>
              <span className="title-highlight">Noble Quran</span>
            </h1>
          </div>

          <div className={`hero-subtitle ${isVisible ? 'animate-in delay-500' : ''}`}>
            <p>
              Embark on a transformative journey with the Holy Quran through our comprehensive learning platform, 
              designed to guide you with wisdom, understanding, and spiritual growth.
            </p>
          </div>

          <div className={`hero-buttons ${isVisible ? 'animate-in delay-700' : ''}`}>
            <button className="btn-primary large">
              <span>📖 Start Learning</span>
            </button>

            <button className="btn-secondary large">
              <span>▶️ Watch Demo</span>
            </button>
          </div>

          <div className={`stats-grid ${isVisible ? 'animate-in delay-900' : ''}`}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of your sections remain the same... */}
      {/* Daily Verse Section */}
      <section className="daily-verse">
        <div className="section-content">
          <div style={{ textAlign: "center" }}>
            <h2 className="section-title">Daily Verse</h2>
            <p className="section-subtitle">Reflect upon the wisdom of the Quran</p>
          </div>

          <div className="verse-card">
            <div className="verse-content">
              <div className="arabic-verse">
                {verses[currentVerse].arabic}
              </div>

              <div className="verse-translation">
                &ldquo;{verses[currentVerse].translation}&rdquo;
              </div>

              <div className="verse-reference">
                {verses[currentVerse].reference}
              </div>
            </div>

            <div className="verse-dots">
              {verses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVerse(index)}
                  className={`dot ${index === currentVerse ? 'active' : ''}`}
                  aria-label={`Show verse ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Why Choose QuranicLearn?</h2>
            <p className="section-subtitle">
              Discover the comprehensive features designed to enhance your Quranic learning experience
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">What Our Learners Say</h2>
            <p className="section-subtitle">Join thousands who have transformed their Quranic journey</p>
          </div>

          <div className="testimonial-container">
            <div className="testimonial-card">
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>

              <blockquote className="testimonial-text">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </blockquote>

              <div className="testimonial-author">
                <div className="author-name">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="author-info">
                  {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].location}
                </div>
              </div>
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="section-content">
          <h2 className="cta-title">Begin Your Sacred Journey</h2>
          <p className="cta-subtitle">
            Take the first step towards a deeper connection with the Holy Quran. 
            Join our community of learners today.
          </p>

          <div className="cta-buttons">
            <button className="btn-primary large">Start Free Trial</button>
            <button className="btn-outline large">Learn More</button>
          </div>

          <div className="cta-features">
            <span className="cta-feature">✓ Free 7-day trial</span>
            <span className="cta-feature">✓ No credit card required</span>
            <span className="cta-feature">✓ Cancel anytime</span>
          </div>
        </div>
      </section>
    </div>
  );
}