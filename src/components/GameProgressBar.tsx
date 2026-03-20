import { motion } from 'framer-motion';

interface GameProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

export function GameProgressBar({ value, max, label = '进度' }: GameProgressBarProps) {
  // 如果没有设置 max，则只显示当前数值（无进度条填充）
  const hasMax = max !== undefined && max > 0;
  const percentage = hasMax ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="relative h-8 overflow-hidden rounded-xl border-2 border-white/50 bg-white/30 shadow-sm md:h-9">
        {/* 进度填充 - 仅当有最大值时显示 */}
        {hasMax && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-violet-400 to-purple-500"
          />
        )}

        {/* 进度文字（居中显示） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-purple-700 md:text-sm">
            {hasMax ? `${label}: ${value}/${max}` : `${label}: ${value}`}
          </span>
        </div>
      </div>
    </div>
  );
}
