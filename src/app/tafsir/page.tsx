import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '../../components/Navbar/Navbar';
import './Tafsir.css';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Quran Tafsir (Explanation) — QuranLearn AI',
  description: 'Explore Quran Tafsir (exegesis) with comprehensive explanations from multiple scholars. Understand historical context, language nuances, and deep meanings of the Quran.',
  keywords: 'quran tafsir, quran explanation, tafseer, quran commentary, quran meaning, quranic exegesis',
  openGraph: {
    title: 'Quran Tafsir (Explanation) — QuranLearn AI',
    description: 'Comprehensive Quran explanations from multiple renowned scholars',
    type: 'website',
    images: [
      {
        url: '/tafsir-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QuranLearn AI - Quran Tafsir'
      }
    ]
  }
};

const TafsirPage = () => (
  <>
    <Navbar />
    <main className="tafsir-page">
      <section className="tafsir-hero">
        <div className="hero-content">
          <h1>Understanding The Quran <br /><span>Through Tafsir</span></h1>
          <p className="lead">Explore the deeper meanings of the Quran with comprehensive explanations from renowned scholars</p>
          <div className="search-container">
            <input type="text" placeholder="Search by Surah, verse, or keyword..." />
            <button><i className="fas fa-search"></i></button>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/tafsir-hero-image.png"
            alt="Quran Tafsir Illustration"
            width={600}
            height={400}
            priority
          />
        </div>
      </section>

      <section className="tafsir-scholars">
        <div className="container">
          <h2>Available Tafsir Collections</h2>
          <p className="section-description">Access explanations from these renowned scholars and resources</p>

          <div className="scholar-grid">
            <div className="scholar-card">
              <Image
                src="/tafsir-ibn-kathir.jpg"
                alt="Ibn Kathir Tafsir Book Cover"
                width={300}
                height={400}
              />
              <h3>Tafsir Ibn Kathir</h3>
              <p>Classic Sunni tafsir by 14th century scholar Ismail Ibn Kathir, focusing on traditional narrations.</p>
              <button className="btn btn-outline">Explore</button>
            </div>

            <div className="scholar-card featured">
              <div className="featured-badge">Most Popular</div>
              <Image
                src="/tafsir-maariful-quran.jpg"
                alt="Maariful Quran Tafsir Book Cover"
                width={300}
                height={400}
              />
              <h3>Ma'ariful Quran</h3>
              <p>Comprehensive commentary by Mufti Muhammad Shafi Usmani, balancing traditional and modern perspectives.</p>
              <button className="btn btn-outline">Explore</button>
            </div>

            <div className="scholar-card">
              <Image
                src="/tafsir-tabari.jpg"
                alt="Al-Tabari Tafsir Book Cover"
                width={300}
                height={400}
              />
              <h3>Tafsir al-Tabari</h3>
              <p>One of the earliest and most extensive Quranic commentaries by the 9th-10th century scholar.</p>
              <button className="btn btn-outline">Explore</button>
            </div>

            <div className="scholar-card">
              <Image
                src="/tafsir-qurtubi.jpg"
                alt="Al-Qurtubi Tafsir Book Cover"
                width={300}
                height={400}
              />
              <h3>Tafsir al-Qurtubi</h3>
              <p>Renowned for its comprehensive approach to legal interpretations and linguistic analysis.</p>
              <button className="btn btn-outline">Explore</button>
            </div>

            <div className="scholar-card">
              <Image
                src="/tafsir-tafheem.jpg"
                alt="Tafheem ul Quran Tafsir Book Cover"
                width={300}
                height={400}
              />
              <h3>Tafheem-ul-Quran</h3>
              <p>Modern commentary by Syed Abul Ala Maududi with focus on contemporary relevance and guidance.</p>
              <button className="btn btn-outline">Explore</button>
            </div>

            <div className="scholar-card">
              <Image
                src="/tafsir-jalalain.jpg"
                alt="Tafsir al-Jalalayn Book Cover"
                width={300}
                height={400}
              />
              <h3>Tafsir al-Jalalayn</h3>
              <p>Concise interpretation by Jalal ad-Din al-Mahalli and Jalal ad-Din as-Suyuti.</p>
              <button className="btn btn-outline">Explore</button>
            </div>
          </div>
        </div>
      </section>

      <section className="tafsir-features">
        <div className="container">
          <h2>Our Unique Approach to Tafsir</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h3>Compare Interpretations</h3>
              <p>View multiple scholars' explanations side-by-side to gain a broader understanding of each verse.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-history"></i>
              </div>
              <h3>Historical Context</h3>
              <p>Understand the circumstances of revelation (Asbab al-Nuzul) to grasp the complete meaning.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-language"></i>
              </div>
              <h3>Linguistic Analysis</h3>
              <p>Explore the nuances of Arabic words, grammar, and rhetoric that enrich the Quranic text.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-book-reader"></i>
              </div>
              <h3>Contemporary Relevance</h3>
              <p>Connect classical interpretations with modern contexts for practical application in today's world.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-tafsirs">
        <div className="container">
          <h2>Popular Tafsir Topics</h2>
          <div className="topics-grid">
            <a href="/tafsir/surah-al-fatiha" className="topic-card">
              <h3>Surah Al-Fatiha</h3>
              <p>The Opening - 7 verses</p>
            </a>

            <a href="/tafsir/ayat-al-kursi" className="topic-card">
              <h3>Ayat al-Kursi</h3>
              <p>The Throne Verse (2:255)</p>
            </a>

            <a href="/tafsir/surah-al-kahf" className="topic-card">
              <h3>Surah Al-Kahf</h3>
              <p>The Cave - 110 verses</p>
            </a>

            <a href="/tafsir/surah-yasin" className="topic-card">
              <h3>Surah Ya-Sin</h3>
              <p>Ya Sin - 83 verses</p>
            </a>

            <a href="/tafsir/last-ten-surahs" className="topic-card">
              <h3>Last 10 Surahs</h3>
              <p>Frequently recited in prayers</p>
            </a>

            <a href="/tafsir/stories" className="topic-card">
              <h3>Quranic Stories</h3>
              <p>Prophets and historical events</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default TafsirPage;