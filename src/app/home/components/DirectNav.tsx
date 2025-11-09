'use client';

import Link from 'next/link';
import styles from './DirectNav.module.css';

const DirectNav = () => {
  const navItems = [
    { title: 'Read Quran', href: '/quran', icon: '📖' },
    { title: 'Learn Tajweed', href: '/tajweed', icon: '🎯' },
    { title: 'Audio Quran', href: '/audio-quran', icon: '🔊' },
    { title: 'Prayer Times', href: '/prayer-time', icon: '🕌' }
  ];

  return (
    <nav className={styles.directNav}>
      {navItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href}
          className={styles.navButton}
        >
          <span className={styles.icon}>{item.icon}</span>
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default DirectNav;