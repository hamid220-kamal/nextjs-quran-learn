import React from 'react';
import Link from 'next/link';
import styles from './HomeNavigations.module.css';

const HomeNavigations = () => {
  const mainFeatures = [
    {
      title: "Start Reading",
      arabic: "الْفَاتِحَة",
      subtitle: "1. Al-Fatihah (The Opener)",
      link: "/surah/1",
      cta: "Begin",
      highlight: true
    },
    {
      title: "Quran Player",
      description: "Listen to Quran recitations with translations",
      link: "/quran-player",
      cta: "Listen Now",
      icon: "🎧"
    },
    {
      title: "Quran Courses",
      description: "Learn Quran with structured courses",
      link: "/courses",
      cta: "Browse Courses",
      icon: "📚"
    }
  ];

  const communityFeatures = [
    {
      title: "Community",
      description: "Join discussions and share Quran reflections",
      link: "/community",
      icon: "👥"
    },
    {
      title: "About Us",
      description: "Learn more about our mission and goals",
      link: "/about",
      icon: "ℹ️"
    }
  ];

  const studyFeatures = [
    {
      title: "Tafsir Studies",
      description: "Understand deeper meanings",
      link: "/tafsir",
      icon: "📖"
    },
    {
      title: "Duas & Supplications",
      description: "Collection of Quranic duas",
      link: "/duas",
      icon: "🤲"
    },
    {
      title: "Hifz Program",
      description: "Memorize Quran with structured guidance",
      link: "/hifz",
      icon: "📿"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Main Features */}
      <div className={styles.mainFeatures}>
        {mainFeatures.map((feature, index) => (
          <Link href={feature.link} key={index} className={`${styles.featureCard} ${feature.highlight ? styles.highlight : ''}`}>
            <div className={styles.cardContent}>
              {feature.arabic && (
                <div className={styles.arabicTitle}>{feature.arabic}</div>
              )}
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              {feature.subtitle && (
                <div className={styles.subtitle}>{feature.subtitle}</div>
              )}
              {feature.description && (
                <p className={styles.description}>{feature.description}</p>
              )}
              <button className={styles.ctaButton}>
                {feature.cta}
                <span className={styles.arrow}>›</span>
              </button>
            </div>
            {feature.icon && (
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Community & Study Features */}
      <div className={styles.secondaryFeatures}>
        <div className={styles.featureColumn}>
          <h2 className={styles.columnTitle}>Community</h2>
          {communityFeatures.map((feature, index) => (
            <Link href={feature.link} key={index} className={styles.featureLink}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <div className={styles.featureInfo}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <span className={styles.arrowIcon}>›</span>
            </Link>
          ))}
        </div>

        <div className={styles.featureColumn}>
          <h2 className={styles.columnTitle}>Learn & Study</h2>
          {studyFeatures.map((feature, index) => (
            <Link href={feature.link} key={index} className={styles.featureLink}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <div className={styles.featureInfo}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <span className={styles.arrowIcon}>›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeNavigations;