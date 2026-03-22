import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'green' | 'blue' | 'purple' | 'red';
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color = 'blue', showLabel = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    green: { gradient: 'bg-gradient-to-r from-green-400 to-emerald-500', fallback: '#4ade80' },
    blue: { gradient: 'bg-gradient-to-r from-blue-400 to-indigo-500', fallback: '#60a5fa' },
    purple: { gradient: 'bg-gradient-to-r from-purple-400 to-pink-500', fallback: '#c084fc' },
    red: { gradient: 'bg-gradient-to-r from-red-400 to-orange-500', fallback: '#f87171' },
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm font-medium text-purple-700 md:text-base lg:text-lg">
          <span>进度</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-4 overflow-hidden rounded-full bg-white shadow-inner md:h-5 lg:h-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClasses[color].gradient}`}
          style={{ backgroundColor: colorClasses[color].fallback }}
        />
      </div>
    </div>
  );
}
