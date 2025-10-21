import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import './Community.css';
import Footer from '../../components/Footer';
// SEO Metadata
export const metadata: Metadata = {
  title: 'Quranic Learning Community — QuranLearn AI',
  description: 'Join our global community of Quran learners. Connect with study groups, participate in discussions, share insights, and grow together on your Quranic journey.',
  keywords: 'quran community, islamic study groups, quran discussions, quran learning forum, muslim community, islamic education network',
  openGraph: {
    title: 'Quranic Learning Community — QuranLearn AI',
    description: 'Join our global community of Quran learners and grow together',
    type: 'website',
    images: [
      {
        url: '/community-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QuranLearn AI - Community'
      }
    ]
  }
};

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main className="community-page">
        <section className="community-hero">
          <div className="container">
            <div className="hero-content">
              <h1>Join Our Global <span>Quranic Community</span></h1>
              <p className="lead">Connect, learn, and grow with fellow Quran enthusiasts from around the world</p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">15,000+</div>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">120+</div>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Study Groups</div>
                </div>
              </div>
              <div className="hero-buttons">
                <button className="btn btn-primary">Join Community</button>
                <button className="btn btn-secondary">Learn More</button>
              </div>
            </div>
            <div className="hero-image">
              <img src="/community-illustration.svg" alt="Community Illustration" />
            </div>
          </div>
        </section>

        <section className="community-features">
          <div className="container">
            <div className="section-header">
              <h2>What Our Community Offers</h2>
              <p>Discover the benefits of joining our vibrant community of learners</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Study Groups</h3>
                <p>Join or create study groups based on your interests, level, and goals. Connect with peers who share your learning path.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Discussion Forums</h3>
                <p>Engage in meaningful conversations about Quranic verses, tafsir, and Islamic knowledge with scholars and students.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-video"></i>
                </div>
                <h3>Live Sessions</h3>
                <p>Participate in scheduled live classes, Q&A sessions with scholars, and interactive workshops.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h3>Challenges & Competitions</h3>
                <p>Take part in memorization challenges, recitation competitions, and knowledge quizzes with rewards.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-hands-helping"></i>
                </div>
                <h3>Peer Support</h3>
                <p>Get help with your recitation, memorization, or understanding from peers through our buddy system.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h3>Community Events</h3>
                <p>Join virtual and local gatherings, Ramadan programs, and special events throughout the Islamic calendar.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="active-groups">
          <div className="container">
            <div className="section-header">
              <h2>Active Study Groups</h2>
              <p>Browse through our most active learning circles and find your perfect match</p>
            </div>
            
            <div className="groups-filter">
              <button className="filter-btn active">All Groups</button>
              <button className="filter-btn">Beginner Friendly</button>
              <button className="filter-btn">Memorization</button>
              <button className="filter-btn">Tajweed</button>
              <button className="filter-btn">Tafsir</button>
              <button className="filter-btn">Women Only</button>
            </div>
            
            <div className="groups-grid">
              <div className="group-card">
                <div className="group-banner">
                  <span className="group-members">
                    <i className="fas fa-user"></i> 42 members
                  </span>
                </div>
                <div className="group-content">
                  <div className="group-category">Memorization</div>
                  <h3 className="group-name">Juz Amma Memorization Circle</h3>
                  <p className="group-description">A supportive group focused on memorizing the 30th Juz of the Quran with proper tajweed.</p>
                  <div className="group-details">
                    <span><i className="fas fa-globe"></i> English, Arabic</span>
                    <span><i className="fas fa-signal"></i> Beginner to Intermediate</span>
                  </div>
                  <div className="group-schedule">
                    <i className="fas fa-clock"></i> Meets every Saturday and Wednesday
                  </div>
                  <button className="btn btn-outline-primary">Join Group</button>
                </div>
              </div>
              
              <div className="group-card featured">
                <div className="group-banner">
                  <span className="group-badge">Popular</span>
                  <span className="group-members">
                    <i className="fas fa-user"></i> 78 members
                  </span>
                </div>
                <div className="group-content">
                  <div className="group-category">Tajweed</div>
                  <h3 className="group-name">Perfecting Quranic Pronunciation</h3>
                  <p className="group-description">Master the rules of tajweed with personalized feedback and regular practice sessions.</p>
                  <div className="group-details">
                    <span><i className="fas fa-globe"></i> Multiple Languages</span>
                    <span><i className="fas fa-signal"></i> All Levels</span>
                  </div>
                  <div className="group-schedule">
                    <i className="fas fa-clock"></i> Daily sessions available
                  </div>
                  <button className="btn btn-outline-primary">Join Group</button>
                </div>
              </div>
              
              <div className="group-card">
                <div className="group-banner">
                  <span className="group-members">
                    <i className="fas fa-user"></i> 35 members
                  </span>
                </div>
                <div className="group-content">
                  <div className="group-category">Tafsir</div>
                  <h3 className="group-name">Deep Dive: Surah Al-Kahf</h3>
                  <p className="group-description">Explore the meanings, lessons, and historical context of Surah Al-Kahf (The Cave).</p>
                  <div className="group-details">
                    <span><i className="fas fa-globe"></i> English</span>
                    <span><i className="fas fa-signal"></i> Intermediate</span>
                  </div>
                  <div className="group-schedule">
                    <i className="fas fa-clock"></i> Fridays after Maghrib
                  </div>
                  <button className="btn btn-outline-primary">Join Group</button>
                </div>
              </div>
            </div>
            
            <div className="groups-action">
              <button className="btn btn-primary">View All Groups</button>
              <button className="btn btn-secondary">Create New Group</button>
            </div>
          </div>
        </section>
        
        <section className="upcoming-events">
          <div className="container">
            <div className="section-header">
              <h2>Upcoming Community Events</h2>
              <p>Mark your calendar for these inspiring and educational gatherings</p>
            </div>
            
            <div className="events-slider">
              <div className="event-card">
                <div className="event-date">
                  <div className="date-day">15</div>
                  <div className="date-month">JUN</div>
                </div>
                <div className="event-content">
                  <div className="event-type">Workshop</div>
                  <h3 className="event-title">Mastering Makhaarij Al-Huroof</h3>
                  <div className="event-details">
                    <div><i className="fas fa-clock"></i> 7:00 PM - 9:00 PM (EST)</div>
                    <div><i className="fas fa-user"></i> Sheikh Ahmad Khalid</div>
                    <div><i className="fas fa-video"></i> Online via Zoom</div>
                  </div>
                  <div className="event-actions">
                    <button className="btn btn-sm btn-primary">Register Now</button>
                    <button className="btn btn-sm btn-outline">Add to Calendar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="community-testimonials">
          <div className="container">
            <div className="section-header">
              <h2>Voices from Our Community</h2>
              <p>Hear what our members have to say about their experiences</p>
            </div>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"The community has been instrumental in my Quran journey. The support from fellow learners and the structured approach to memorization has helped me memorize 3 juz in just 6 months."</p>
                </div>
                <div className="testimonial-author">
                  <img src="/testimonial-1.jpg" alt="Aisha" />
                  <div>
                    <h4>Aisha R.</h4>
                    <p>Member since 2022</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"As someone who struggled with tajweed, the peer feedback system and expert guidance in the community has transformed my recitation. The weekly group sessions keep me motivated."</p>
                </div>
                <div className="testimonial-author">
                  <img src="/testimonial-2.jpg" alt="Omar" />
                  <div>
                    <h4>Omar H.</h4>
                    <p>Member since 2021</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"Finding a community that shares my passion for understanding the Quran deeply has been life-changing. The tafsir discussions are intellectually stimulating and spiritually uplifting."</p>
                </div>
                <div className="testimonial-author">
                  <img src="/testimonial-3.jpg" alt="Fatima" />
                  <div>
                    <h4>Fatima K.</h4>
                    <p>Member since 2023</p>
                  </div>
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