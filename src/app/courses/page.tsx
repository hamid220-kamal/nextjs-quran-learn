
import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/Navbar/Navbar';
import './Courses.css';
import Footer from '../../components/Footer';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Quranic Courses — QuranLearn AI',
  description: 'Learn Quran through interactive courses designed for all levels. Tajweed, Memorization, and Tafsir courses with real-time feedback and personalized learning paths.',
  keywords: 'Quran courses, Islamic education, Tajweed courses, Quran memorization, Tafsir classes, online Quran learning',
  openGraph: {
    title: 'Quranic Courses — QuranLearn AI',
    description: 'Interactive Quran courses with personalized learning paths',
    type: 'website',
    images: [
      {
        url: '/courses-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QuranLearn AI - Quranic Courses'
      }
    ]
  }
};

const CoursesPage = () => {
  return (
    <>
      <Navbar />
      <main className="courses-page">
        <section className="courses-hero">
          <div className="container">
            <h1>Quranic Learning Courses</h1>
            <p className="lead">Discover our interactive learning paths designed to help you connect with the Quran</p>
          </div>
        </section>

        <section className="courses-grid">
          <div className="container">
            <h2>Featured Courses</h2>
            <div className="courses-list">
              {/* Course cards would be mapped here from API data */}
              <div className="course-card">
                <div className="course-image">
                  <img src="/tajweed-course.jpg" alt="Tajweed Course" />
                  <span className="course-level">Beginner</span>
                </div>
                <div className="course-content">
                  <h3>Tajweed Fundamentals</h3>
                  <p>Learn the essential rules of proper Quranic recitation with interactive exercises.</p>
                  <div className="course-meta">
                    <span><i className="fas fa-clock"></i> 8 weeks</span>
                    <span><i className="fas fa-user"></i> 2,500+ enrolled</span>
                  </div>
                  <button className="btn btn-primary">Enroll Now</button>
                </div>
              </div>
              
              <div className="course-card">
                <div className="course-image">
                  <img src="/memorization-course.jpg" alt="Memorization Course" />
                  <span className="course-level">Intermediate</span>
                </div>
                <div className="course-content">
                  <h3>Hifdh: Juz Amma</h3>
                  <p>Memorize the 30th Juz of the Quran with our proven memorization techniques.</p>
                  <div className="course-meta">
                    <span><i className="fas fa-clock"></i> 12 weeks</span>
                    <span><i className="fas fa-user"></i> 1,800+ enrolled</span>
                  </div>
                  <button className="btn btn-primary">Enroll Now</button>
                </div>
              </div>
              
              <div className="course-card">
                <div className="course-image">
                  <img src="/tafsir-course.jpg" alt="Tafsir Course" />
                  <span className="course-level">Advanced</span>
                </div>
                <div className="course-content">
                  <h3>Tafsir: Understanding Surah Al-Baqarah</h3>
                  <p>Deep dive into the meanings and contexts of the longest Surah in the Quran.</p>
                  <div className="course-meta">
                    <span><i className="fas fa-clock"></i> 16 weeks</span>
                    <span><i className="fas fa-user"></i> 1,200+ enrolled</span>
                  </div>
                  <button className="btn btn-primary">Enroll Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="courses-categories">
          <div className="container">
            <h2>Browse by Category</h2>
            <div className="category-list">
              <a href="#tajweed" className="category-item">
                <i className="fas fa-microphone"></i>
                <span>Tajweed</span>
              </a>
              <a href="#memorization" className="category-item">
                <i className="fas fa-brain"></i>
                <span>Memorization</span>
              </a>
              <a href="#tafsir" className="category-item">
                <i className="fas fa-book-open"></i>
                <span>Tafsir</span>
              </a>
              <a href="#arabic" className="category-item">
                <i className="fas fa-language"></i>
                <span>Arabic</span>
              </a>
              <a href="#beginners" className="category-item">
                <i className="fas fa-seedling"></i>
                <span>For Beginners</span>
              </a>
              <a href="#children" className="category-item">
                <i className="fas fa-child"></i>
                <span>For Children</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CoursesPage;