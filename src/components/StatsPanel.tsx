import { motion } from 'framer-motion';
import type { Stats } from '../utils/storage';
import { getTodayAccuracy } from '../utils/storage';

interface StatsPanelProps {
  stats: Stats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const todayAccuracy = getTodayAccuracy();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      <StatCard
        icon="🏆"
        label="最高分"
        value={stats.highestScore.toString()}
        color="from-yellow-400 to-orange-500"
      />
      <StatCard
        icon="🔥"
        label="最长连击"
        value={stats.longestStreak.toString()}
        color="from-red-400 to-pink-500"
      />
      <StatCard
        icon="📊"
        label="今日正确率"
        value={todayAccuracy > 0 ? `${todayAccuracy}%` : '-'}
        color="from-green-400 to-emerald-500"
      />
      <StatCard
        icon="📝"
        label="总答题数"
        value={stats.totalAnswered.toString()}
        color="from-blue-400 to-indigo-500"
      />
    </motion.div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${color} p-4 shadow-lg`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs text-white/80">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
