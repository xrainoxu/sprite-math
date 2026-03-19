// 练习记录接口
export interface PracticeRecord {
  date: string; // YYYY-MM-DD
  correctCount: number;
  totalCount: number;
  modes: {
    [mode: string]: {
      correctCount: number;
      totalCount: number;
    };
  };
}

// 统计数据接口
export interface Stats {
  highestScore: number; // 计时挑战最高分
  longestStreak: number; // 最长连续答对
  totalAnswered: number; // 总答题数
  totalCorrect: number; // 总正确数
  practiceRecords: PracticeRecord[];
}

// 获取本地存储 key
const STORAGE_KEY = 'mathfun_stats';

// 默认统计数据
const defaultStats: Stats = {
  highestScore: 0,
  longestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  practiceRecords: [],
};

// 获取统计数据
export function getStats(): Stats {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return { ...defaultStats };
}

// 保存统计数据
export function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

// 更新计时挑战最高分
export function updateHighestScore(score: number): Stats {
  const stats = getStats();
  if (score > stats.highestScore) {
    stats.highestScore = score;
    saveStats(stats);
  }
  return stats;
}

// 更新最长连续答对
export function updateLongestStreak(streak: number): Stats {
  const stats = getStats();
  if (streak > stats.longestStreak) {
    stats.longestStreak = streak;
    saveStats(stats);
  }
  return stats;
}

// 记录一次答题结果
export function recordAnswer(correct: boolean, mode: string): Stats {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];

  // 更新总数
  stats.totalAnswered++;
  if (correct) {
    stats.totalCorrect++;
  }

  // 更新今日记录
  let todayRecord = stats.practiceRecords.find((r) => r.date === today);
  if (!todayRecord) {
    todayRecord = {
      date: today,
      correctCount: 0,
      totalCount: 0,
      modes: {},
    };
    stats.practiceRecords.push(todayRecord);
  }

  todayRecord.totalCount++;
  if (correct) {
    todayRecord.correctCount++;
  }

  // 更新模式记录
  if (!todayRecord.modes[mode]) {
    todayRecord.modes[mode] = { correctCount: 0, totalCount: 0 };
  }
  todayRecord.modes[mode].totalCount++;
  if (correct) {
    todayRecord.modes[mode].correctCount++;
  }

  // 只保留最近30天的记录
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  stats.practiceRecords = stats.practiceRecords.filter(
    (r) => new Date(r.date) >= thirtyDaysAgo
  );

  saveStats(stats);
  return stats;
}

// 获取今日正确率
export function getTodayAccuracy(): number {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = stats.practiceRecords.find((r) => r.date === today);

  if (!todayRecord || todayRecord.totalCount === 0) {
    return 0;
  }

  return Math.round((todayRecord.correctCount / todayRecord.totalCount) * 100);
}

// 重置统计数据
export function resetStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
