/**
 * ===== PRAYER TIME APP - PRAYER TRACKING SYSTEM =====
 * Real prayer tracking with daily, monthly, yearly streaks and statistics
 * Features: Mark completed/missed, streak calculation, analytics, historical data
 */

import { loadPrayerStats, savePrayerStats } from './localStorage';

export type PrayerStatus = 'completed' | 'missed' | 'pending';

export interface DailyPrayerRecord {
  Fajr: PrayerStatus;
  Dhuhr: PrayerStatus;
  Asr: PrayerStatus;
  Maghrib: PrayerStatus;
  Isha: PrayerStatus;
}

export interface PrayerStats {
  today: number; // prayers completed today
  streak: number; // current consecutive days
  thisMonth: number; // prayers completed this month
  total: number; // all-time prayers completed
  dailyHistory: Record<string, DailyPrayerRecord>; // YYYY-MM-DD format
  monthlyStats: Record<string, number>; // YYYY-MM format
  yearlyStats: Record<string, number>; // YYYY format
  completionRate: number; // percentage 0-100
  longestStreak: number; // longest streak ever
  lastUpdated: number; // timestamp
}

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_EMOJIS: Record<string, string> = {
  Fajr: '🌅',
  Dhuhr: '☀️',
  Asr: '🌤️',
  Maghrib: '🌅',
  Isha: '🌙',
};

// ========== DATE UTILITIES ==========

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date();
  return now.toISOString().split('T')[0].substring(0, 7);
}

/**
 * Get current year in YYYY format
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}

/**
 * Get date X days ago in YYYY-MM-DD format
 */
export function getDateAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ========== PRAYER TRACKING OPERATIONS ==========

/**
 * Initialize empty prayer record for today
 */
export function createEmptyDailyRecord(): DailyPrayerRecord {
  return {
    Fajr: 'pending',
    Dhuhr: 'pending',
    Asr: 'pending',
    Maghrib: 'pending',
    Isha: 'pending',
  };
}

/**
 * Get today's prayer record
 */
export function getTodayPrayerRecord(): DailyPrayerRecord {
  const stats = loadPrayerStats();
  const today = getTodayDate();
  
  if (!stats.dailyHistory[today]) {
    stats.dailyHistory[today] = createEmptyDailyRecord();
    savePrayerStats(stats);
  }
  
  return stats.dailyHistory[today];
}

/**
 * Mark prayer as completed
 */
export function markPrayerCompleted(prayer: string): void {
  const stats = loadPrayerStats();
  const today = getTodayDate();
  
  if (!stats.dailyHistory[today]) {
    stats.dailyHistory[today] = createEmptyDailyRecord();
  }
  
  const record = stats.dailyHistory[today];
  if (record[prayer as keyof DailyPrayerRecord] === 'pending') {
    record[prayer as keyof DailyPrayerRecord] = 'completed';
    stats.today += 1;
    stats.total += 1;
    stats.lastUpdated = Date.now();
    
    updateMonthlyStats(stats, today);
    updateYearlyStats(stats, today);
    updateStreak(stats, today);
    
    savePrayerStats(stats);
    console.log(`✅ Prayer marked completed: ${prayer}`);
  }
}

/**
 * Mark prayer as missed
 */
export function markPrayerMissed(prayer: string): void {
  const stats = loadPrayerStats();
  const today = getTodayDate();
  
  if (!stats.dailyHistory[today]) {
    stats.dailyHistory[today] = createEmptyDailyRecord();
  }
  
  const record = stats.dailyHistory[today];
  if (record[prayer as keyof DailyPrayerRecord] === 'pending') {
    record[prayer as keyof DailyPrayerRecord] = 'missed';
    stats.lastUpdated = Date.now();
    
    updateMonthlyStats(stats, today);
    updateYearlyStats(stats, today);
    // Streak breaks on missed prayer
    stats.streak = 0;
    
    savePrayerStats(stats);
    console.log(`⏭️ Prayer marked missed: ${prayer}`);
  }
}

/**
 * Undo prayer status (set back to pending)
 */
export function undoPrayerStatus(prayer: string): void {
  const stats = loadPrayerStats();
  const today = getTodayDate();
  
  if (stats.dailyHistory[today]) {
    const record = stats.dailyHistory[today];
    const currentStatus = record[prayer as keyof DailyPrayerRecord];
    
    if (currentStatus === 'completed') {
      stats.today -= 1;
      stats.total -= 1;
    }
    
    record[prayer as keyof DailyPrayerRecord] = 'pending';
    stats.lastUpdated = Date.now();
    
    savePrayerStats(stats);
    console.log(`↩️ Prayer status undone: ${prayer}`);
  }
}

// ========== STREAK CALCULATION ==========

/**
 * Update current streak
 */
function updateStreak(stats: any, today: string): void {
  let streak = 0;
  let checkDate = new Date(today);
  
  // Count consecutive days with all prayers completed
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayRecord = stats.dailyHistory[dateStr];
    
    if (!dayRecord || !isFullDay(dayRecord)) {
      break;
    }
    
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  stats.streak = streak;
  
  // Update longest streak
  if (streak > stats.longestStreak) {
    stats.longestStreak = streak;
  }
}

/**
 * Check if all prayers completed for a day
 */
function isFullDay(record: DailyPrayerRecord): boolean {
  return (
    record.Fajr === 'completed' &&
    record.Dhuhr === 'completed' &&
    record.Asr === 'completed' &&
    record.Maghrib === 'completed' &&
    record.Isha === 'completed'
  );
}

/**
 * Count completed prayers in a day
 */
export function countDayPrayers(record: DailyPrayerRecord | undefined): number {
  if (!record) return 0;
  return Object.values(record).filter(s => s === 'completed').length;
}

/**
 * Count all prayers in a day
 */
export function countDayTotal(record: DailyPrayerRecord | undefined): number {
  return PRAYERS.length; // Always 5 prayers
}

// ========== MONTHLY/YEARLY STATISTICS ==========

/**
 * Update monthly statistics
 */
function updateMonthlyStats(stats: any, today: string): void {
  const month = today.substring(0, 7); // YYYY-MM
  
  if (!stats.monthlyStats) {
    stats.monthlyStats = {};
  }
  
  // Count all completed prayers in this month
  let count = 0;
  for (const [date, record] of Object.entries(stats.dailyHistory)) {
    if (date.startsWith(month)) {
      count += countDayPrayers(record as DailyPrayerRecord);
    }
  }
  
  stats.monthlyStats[month] = count;
  stats.thisMonth = count;
}

/**
 * Update yearly statistics
 */
function updateYearlyStats(stats: any, today: string): void {
  const year = today.substring(0, 4); // YYYY
  
  if (!stats.yearlyStats) {
    stats.yearlyStats = {};
  }
  
  // Count all completed prayers in this year
  let count = 0;
  for (const [date, record] of Object.entries(stats.dailyHistory)) {
    if (date.startsWith(year)) {
      count += countDayPrayers(record as DailyPrayerRecord);
    }
  }
  
  stats.yearlyStats[year] = count;
}

// ========== STATISTICS & ANALYTICS ==========

/**
 * Get completion rate (0-100%)
 */
export function getCompletionRate(): number {
  const stats = loadPrayerStats();
  if (stats.total === 0) return 0;
  return (stats.today / (PRAYERS.length)) * 100;
}

/**
 * Get weekly summary
 */
export function getWeeklySummary(): {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}[] {
  const stats = loadPrayerStats();
  const summary: { date: string; completed: number; total: number; percentage: number; }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = getDateAgo(i);
    const record = stats.dailyHistory[date];
    const completed = countDayPrayers(record);
    const total = PRAYERS.length;
    const percentage = (completed / total) * 100;
    
    summary.push({
      date,
      completed,
      total,
      percentage,
    });
  }
  
  return summary;
}

/**
 * Get monthly summary
 */
export function getMonthlySummary(month?: string): {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}[] {
  const stats = loadPrayerStats();
  const targetMonth = month || getCurrentMonth();
  const summary: { date: string; completed: number; total: number; percentage: number; }[] = [];
  
  // Get number of days in month
  const [year, monthNum] = targetMonth.split('-').map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${targetMonth}-${day.toString().padStart(2, '0')}`;
    const record = stats.dailyHistory[date];
    const completed = countDayPrayers(record);
    const total = PRAYERS.length;
    const percentage = (completed / total) * 100;
    
    summary.push({
      date,
      completed,
      total,
      percentage,
    });
  }
  
  return summary;
}

/**
 * Get yearly summary
 */
export function getYearlySummary(year?: string): {
  month: string;
  completed: number;
  total: number;
  percentage: number;
}[] {
  const stats = loadPrayerStats();
  const targetYear = year || getCurrentYear();
  const summary: { month: string; completed: number; total: number; percentage: number; }[] = [];
  
  for (let month = 1; month <= 12; month++) {
    const monthStr = `${targetYear}-${month.toString().padStart(2, '0')}`;
    const completed = stats.monthlyStats?.[monthStr] || 0;
    const daysInMonth = new Date(parseInt(targetYear), month, 0).getDate();
    const total = PRAYERS.length * daysInMonth;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    summary.push({
      month: monthStr,
      completed,
      total,
      percentage,
    });
  }
  
  return summary;
}

/**
 * Get prayer statistics
 */
export function getPrayerStats(prayer: string): {
  completed: number;
  missed: number;
  pending: number;
  percentage: number;
} {
  const stats = loadPrayerStats();
  let completed = 0;
  let missed = 0;
  let pending = 0;
  
  for (const record of Object.values(stats.dailyHistory)) {
    const prayerStatus = (record as any)[prayer];
    if (prayerStatus === 'completed') completed++;
    else if (prayerStatus === 'missed') missed++;
    else pending++;
  }
  
  const total = completed + missed;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return { completed, missed, pending, percentage };
}

/**
 * Get comprehensive statistics
 */
export function getComprehensiveStats(): {
  today: number;
  thisMonth: number;
  total: number;
  streak: number;
  longestStreak: number;
  completionRate: number;
  averagePerDay: number;
  averagePerMonth: number;
  mostMissedPrayer: string;
} {
  const stats = loadPrayerStats();
  const daysTracked = Object.keys(stats.dailyHistory).length;
  
  // Find most missed prayer
  let mostMissedPrayer = 'N/A';
  let maxMissed = 0;
  for (const prayer of PRAYERS) {
    const pStats = getPrayerStats(prayer);
    if (pStats.missed > maxMissed) {
      maxMissed = pStats.missed;
      mostMissedPrayer = prayer;
    }
  }
  
  return {
    today: stats.today,
    thisMonth: stats.thisMonth || 0,
    total: stats.total,
    streak: stats.streak,
    longestStreak: stats.longestStreak || 0,
    completionRate: getCompletionRate(),
    averagePerDay: daysTracked > 0 ? stats.total / daysTracked : 0,
    averagePerMonth: stats.total / 12, // rough estimate
    mostMissedPrayer,
  };
}

/**
 * Reset all tracking data (for testing/user request)
 */
export function resetAllTrackingData(): void {
  const defaultStats = {
    today: 0,
    streak: 0,
    thisMonth: 0,
    total: 0,
    dailyHistory: {},
    monthlyStats: {},
    yearlyStats: {},
    completionRate: 0,
    longestStreak: 0,
    lastUpdated: Date.now(),
  };
  
  savePrayerStats(defaultStats);
  console.log('🔄 All tracking data reset');
}

/**
 * Get prayer status emoji
 */
export function getPrayerEmoji(prayer: string): string {
  return PRAYER_EMOJIS[prayer] || '🕌';
}

/**
 * Get prayer status display text
 */
export function getPrayerStatusText(status: PrayerStatus): string {
  switch (status) {
    case 'completed':
      return '✅ Completed';
    case 'missed':
      return '⏭️ Missed';
    case 'pending':
      return '⏳ Pending';
  }
}

/**
 * Format streak display
 */
export function formatStreakDisplay(streak: number): string {
  if (streak === 0) return 'No current streak';
  if (streak === 1) return '🔥 1 day streak';
  if (streak < 7) return `🔥 ${streak} days streak`;
  if (streak < 30) return `🔥🔥 ${streak} days streak`;
  return `🔥🔥🔥 ${streak} days streak`;
}

/**
 * Export tracking data as JSON
 */
export function exportTrackingData(): string {
  const stats = loadPrayerStats();
  return JSON.stringify(stats, null, 2);
}

/**
 * Import tracking data from JSON
 */
export function importTrackingData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    savePrayerStats(data);
    console.log('✅ Tracking data imported');
    return true;
  } catch (error) {
    console.error('❌ Error importing data:', error);
    return false;
  }
}
