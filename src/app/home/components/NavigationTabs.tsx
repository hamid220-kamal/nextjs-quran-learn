import React from 'react';
import styles from './NavigationTabs.module.css';

interface NavigationTabsProps {
  navigationMode: 'surah' | 'juz' | 'manzil' | 'hizb' | 'page' | 'ruku';
  setNavigationMode: (mode: 'surah' | 'juz' | 'manzil' | 'hizb' | 'page' | 'ruku') => void;
}

const tabs = [
  { id: 'surah', title: 'Surahs', count: 114 },
  { id: 'juz', title: 'Juz', count: 30 },
  { id: 'manzil', title: 'Manzil', count: 7 },
  { id: 'hizb', title: 'Hizb', count: 60 },
  { id: 'page', title: 'Pages', count: 604 },
  { id: 'ruku', title: 'Ruku', count: 556 }
];

const NavigationTabs: React.FC<NavigationTabsProps> = ({ navigationMode, setNavigationMode }) => {
  return (
    <nav className={styles.navigationTabs} role="tablist" aria-label="Quran navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={navigationMode === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          className={`${styles.navTab} ${navigationMode === tab.id ? styles.active : ''}`}
          onClick={() => setNavigationMode(tab.id as typeof navigationMode)}
        >
          <span className={styles.navTabContent}>
            <span className={styles.navTabTitle}>{tab.title}</span>
            <span className={styles.navTabCount}>({tab.count})</span>
          </span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationTabs;