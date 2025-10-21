'use client';

import React, { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import './Community.css';
import Footer from '../../components/Footer';

// Types
interface StudyGroup {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  languages: string[];
  level: string;
  schedule: string;
  isFeatured: boolean;
  isJoined: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  type: string;
  date: Date;
  time: string;
  speaker: string;
  platform: string;
  isRegistered: boolean;
}

interface Testimonial {
  id: string;
  content: string;
  author: string;
  joinDate: string;
  avatar: string;
}

// Mock data that would come from your backend
const mockStudyGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'Juz Amma Memorization Circle',
    category: 'Memorization',
    description: 'A supportive group focused on memorizing the 30th Juz of the Quran with proper tajweed and daily revision sessions.',
    members: 42,
    languages: ['English', 'Arabic'],
    level: 'Beginner to Intermediate',
    schedule: 'Every Saturday and Wednesday, 7:00 PM EST',
    isFeatured: false,
    isJoined: false
  },
  {
    id: '2',
    name: 'Perfecting Quranic Pronunciation',
    category: 'Tajweed',
    description: 'Master the rules of tajweed with personalized feedback, weekly practice sessions, and expert guidance.',
    members: 78,
    languages: ['English', 'Arabic', 'Urdu'],
    level: 'All Levels',
    schedule: 'Daily sessions available, flexible timing',
    isFeatured: true,
    isJoined: false
  },
  {
    id: '3',
    name: 'Deep Dive: Surah Al-Kahf',
    category: 'Tafsir',
    description: 'Explore the profound meanings, historical context, and life lessons from Surah Al-Kahf with detailed analysis.',
    members: 35,
    languages: ['English'],
    level: 'Intermediate',
    schedule: 'Fridays after Maghrib prayer',
    isFeatured: false,
    isJoined: false
  }
];

const mockEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Mastering Makhaarij Al-Huroof',
    type: 'Workshop',
    date: new Date(2024, 5, 15), // June 15, 2024
    time: '7:00 PM - 9:00 PM (EST)',
    speaker: 'Sheikh Ahmad Khalid',
    platform: 'Online via Zoom',
    isRegistered: false
  },
  {
    id: '2',
    title: 'Quran Memorization Techniques',
    type: 'Webinar',
    date: new Date(2024, 5, 20),
    time: '6:00 PM - 8:00 PM (EST)',
    speaker: 'Dr. Fatima Al-Mansoori',
    platform: 'Live Stream',
    isRegistered: false
  }
];

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    content: "The community has been instrumental in my Quran journey. The support from fellow learners and the structured approach to memorization has helped me memorize 3 juz in just 6 months. The accountability partners are amazing!",
    author: "Aisha R.",
    joinDate: "Member since 2022",
    avatar: "/api/placeholder/60/60"
  },
  {
    id: '2',
    content: "As someone who struggled with tajweed, the peer feedback system and expert guidance in the community has transformed my recitation. The weekly group sessions keep me motivated and on track with my learning goals.",
    author: "Omar H.",
    joinDate: "Member since 2021",
    avatar: "/api/placeholder/60/60"
  },
  {
    id: '3',
    content: "Finding a community that shares my passion for understanding the Quran deeply has been life-changing. The tafsir discussions are intellectually stimulating and spiritually uplifting. I've made lifelong friends here.",
    author: "Fatima K.",
    joinDate: "Member since 2023",
    avatar: "/api/placeholder/60/60"
  }
];

export default function CommunityPage() {
  // State management
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(mockStudyGroups);
  const [events, setEvents] = useState<CommunityEvent[]>(mockEvents);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [activeFilter, setActiveFilter] = useState('All Groups');
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  const [communityStats, setCommunityStats] = useState({
    members: 15000,
    countries: 120,
    groups: 500
  });

  // Filter study groups
  const filteredGroups = activeFilter === 'All Groups' 
    ? studyGroups 
    : studyGroups.filter(group => 
        group.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
        (activeFilter === 'Beginner Friendly' && group.level.includes('Beginner')) ||
        (activeFilter === 'Women Only' && group.name.toLowerCase().includes('women'))
      );

  // Join study group function
  const joinStudyGroup = async (groupId: string) => {
    setLoadingStates(prev => ({ ...prev, [groupId]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStudyGroups(prev => 
      prev.map(group => 
        group.id === groupId ? { ...group, isJoined: true, members: group.members + 1 } : group
      )
    );
    
    setLoadingStates(prev => ({ ...prev, [groupId]: false }));
    setCommunityStats(prev => ({ ...prev, members: prev.members + 1 }));
  };

  // Register for event function
  const registerForEvent = async (eventId: string) => {
    setLoadingStates(prev => ({ ...prev, [eventId]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, isRegistered: true } : event
      )
    );
    
    setLoadingStates(prev => ({ ...prev, [eventId]: false }));
  };

  // Join community function
  const joinCommunity = async () => {
    setLoadingStates(prev => ({ ...prev, 'joinCommunity': true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCommunityStats(prev => ({ ...prev, members: prev.members + 1 }));
    setLoadingStates(prev => ({ ...prev, 'joinCommunity': false }));
    
    // Show success message (in real app, you'd use a toast notification)
    alert('Welcome to the QuranicLearn community! You have been successfully added.');
  };

  // Format date for events
  const formatEventDate = (date: Date) => {
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  return (
    <>
      <Navbar />
      <main className="community-page">
        {/* Enhanced Hero Section */}
        <section className="community-hero">
          <div className="container">
            <div className="hero-content">
              <h1>Join Our Global <span>Quranic Community</span></h1>
              <p className="lead">
                Connect with passionate learners, engage in meaningful discussions, and grow together 
                in your Quranic journey with real-time interactions and expert guidance.
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{communityStats.members.toLocaleString()}+</span>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{communityStats.countries}+</span>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{communityStats.groups}+</span>
                  <div className="stat-label">Study Groups</div>
                </div>
              </div>
              
              <div className="hero-buttons">
                <button 
                  className={`btn btn-primary ${loadingStates['joinCommunity'] ? 'loading' : ''}`}
                  onClick={joinCommunity}
                  disabled={loadingStates['joinCommunity']}
                >
                  <i className="fas fa-users"></i>
                  {loadingStates['joinCommunity'] ? 'Joining...' : 'Join Community Now'}
                </button>
                <button className="btn btn-secondary">
                  <i className="fas fa-play-circle"></i>
                  Watch Community Tour
                </button>
              </div>
            </div>
            
            <div className="hero-image">
              <img 
                src="/api/placeholder/500/400" 
                alt="Quranic Learning Community Illustration" 
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#1a2a6c"/>
                      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="20">
                        Community Illustration
                      </text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="community-features">
          <div className="container">
            <div className="section-header">
              <h2>What Our Community Offers</h2>
              <p>Experience comprehensive learning with interactive features designed for spiritual growth</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Interactive Study Groups</h3>
                <p>Join real-time study sessions with video calls, shared whiteboards, and collaborative note-taking. Form study circles based on your pace and interests.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Live Discussion Forums</h3>
                <p>Engage in moderated discussions with scholars, ask questions, and participate in Quranic analysis sessions with real-time translation support.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-video"></i>
                </div>
                <h3>Expert Live Sessions</h3>
                <p>Weekly live classes with certified Quran teachers, Q&A sessions with Islamic scholars, and interactive workshops with instant feedback.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h3>Progress Challenges</h3>
                <p>Participate in structured memorization challenges, recitation competitions with judging, and knowledge quizzes with certificates and rewards.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-hands-helping"></i>
                </div>
                <h3>Personalized Peer Support</h3>
                <p>Get matched with accountability partners, receive personalized recitation feedback, and join mentorship programs with advanced learners.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h3>Islamic Calendar Events</h3>
                <p>Special Ramadan programs, Eid celebrations, Islamic history webinars, and community service projects throughout the year.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Active Groups Section */}
        <section className="active-groups">
          <div className="container">
            <div className="section-header">
              <h2>Active Study Groups</h2>
              <p>Join live learning circles and start your journey with like-minded companions</p>
            </div>
            
            <div className="groups-filter">
              {['All Groups', 'Beginner Friendly', 'Memorization', 'Tajweed', 'Tafsir', 'Women Only'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="groups-grid">
              {filteredGroups.map(group => (
                <div key={group.id} className={`group-card ${group.isFeatured ? 'featured' : ''}`}>
                  <div className="group-banner">
                    {group.isFeatured && <span className="group-badge">Popular</span>}
                    <span className="group-members">
                      <i className="fas fa-user"></i> {group.members} members
                    </span>
                  </div>
                  <div className="group-content">
                    <div className="group-category">{group.category}</div>
                    <h3 className="group-name">{group.name}</h3>
                    <p className="group-description">{group.description}</p>
                    <div className="group-details">
                      <span>
                        <i className="fas fa-globe"></i> 
                        {group.languages.join(', ')}
                      </span>
                      <span>
                        <i className="fas fa-signal"></i> 
                        {group.level}
                      </span>
                    </div>
                    <div className="group-schedule">
                      <i className="fas fa-clock"></i> {group.schedule}
                    </div>
                    <button 
                      className={`btn btn-outline-primary ${group.isJoined ? 'success' : ''} ${loadingStates[group.id] ? 'loading' : ''}`}
                      onClick={() => joinStudyGroup(group.id)}
                      disabled={group.isJoined || loadingStates[group.id]}
                    >
                      {loadingStates[group.id] ? 'Joining...' : group.isJoined ? '✓ Joined' : 'Join Group'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="groups-action">
              <button className="btn btn-primary">
                <i className="fas fa-search"></i>
                Explore All Groups
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-plus"></i>
                Create New Group
              </button>
            </div>
          </div>
        </section>
        
        {/* Enhanced Events Section */}
        <section className="upcoming-events">
          <div className="container">
            <div className="section-header">
              <h2>Upcoming Community Events</h2>
              <p>Don't miss these inspiring learning opportunities with renowned scholars</p>
            </div>
            
            <div className="events-slider">
              {events.map(event => {
                const { day, month } = formatEventDate(event.date);
                return (
                  <div key={event.id} className="event-card">
                    <div className="event-date">
                      <div className="date-day">{day}</div>
                      <div className="date-month">{month}</div>
                    </div>
                    <div className="event-content">
                      <div className="event-type">{event.type}</div>
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-details">
                        <div><i className="fas fa-clock"></i> {event.time}</div>
                        <div><i className="fas fa-user"></i> {event.speaker}</div>
                        <div><i className="fas fa-video"></i> {event.platform}</div>
                      </div>
                      <div className="event-actions">
                        <button 
                          className={`btn btn-sm btn-primary ${event.isRegistered ? 'success' : ''} ${loadingStates[event.id] ? 'loading' : ''}`}
                          onClick={() => registerForEvent(event.id)}
                          disabled={event.isRegistered || loadingStates[event.id]}
                        >
                          {loadingStates[event.id] ? 'Registering...' : event.isRegistered ? '✓ Registered' : 'Register Now'}
                        </button>
                        <button className="btn btn-sm btn-outline">
                          <i className="fas fa-calendar-plus"></i>
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Enhanced Testimonials Section */}
        <section className="community-testimonials">
          <div className="container">
            <div className="section-header">
              <h2>Voices from Our Community</h2>
              <p>Real experiences from learners who transformed their Quranic journey with us</p>
            </div>
            
            <div className="testimonials-grid">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-content">
                    <p>{testimonial.content}</p>
                  </div>
                  <div className="testimonial-author">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="30" cy="30" r="30" fill="#fdbb2d"/>
                            <text x="30" y="38" text-anchor="middle" fill="white" font-family="Arial" font-size="18" font-weight="bold">
                              ${testimonial.author.charAt(0)}
                            </text>
                          </svg>
                        `)}`;
                      }}
                    />
                    <div>
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.joinDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}