import { motion } from 'framer-motion';
import { Icon } from './Icon';

interface StatItem {
  value: number | string;
  label: string;
  color: string;
  bgColor: string;
}

interface GameOverProps {
  title: string;
  stats: StatItem[];
  isNewHighScore?: boolean;
  highScore?: number;
  onRestart: () => void;
  onExit: () => void;
  theme?: 'rose' | 'violet' | 'orange';
}

export function GameOver({
  title,
  stats,
  isNewHighScore,
  highScore,
  onRestart,
  onExit,
  theme = 'orange',
}: GameOverProps) {
  const themeStyles = {
    rose: {
      bg: 'from-amber-50 via-orange-50 to-amber-100',
      cardBg: 'bg-white',
      text: 'text-amber-700',
      labelText: 'text-amber-500',
      button: 'bg-amber-500 text-white hover:bg-amber-600',
      secondaryButton: 'bg-amber-200 text-amber-800 hover:bg-amber-300',
    },
    violet: {
      bg: 'from-amber-50 via-orange-50 to-amber-100',
      cardBg: 'bg-white',
      text: 'text-amber-700',
      labelText: 'text-amber-500',
      button: 'bg-amber-500 text-white hover:bg-amber-600',
      secondaryButton: 'bg-amber-200 text-amber-800 hover:bg-amber-300',
    },
    orange: {
      bg: 'from-amber-50 via-orange-50 to-amber-100',
      cardBg: 'bg-white',
      text: 'text-amber-700',
      labelText: 'text-amber-500',
      button: 'bg-amber-500 text-white hover:bg-amber-600',
      secondaryButton: 'bg-amber-200 text-amber-800 hover:bg-amber-300',
    },
  };

  const style = themeStyles[theme];

  return (
    <div className={`flex h-screen flex-col items-center justify-center bg-gradient-to-br ${style.bg} p-2 md:p-4`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center text-center h-full w-full max-w-2xl"
      >
        {/* 标题 */}
        <div className="mb-1">
          <Icon icon="mdi:flag-checkered" className="text-4xl text-amber-600 md:text-6xl" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-amber-700 md:text-5xl">{title}</h1>

        {/* 统计卡片 */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl ${stat.bgColor} p-4 md:p-6 flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px]`}
            >
              <p className={`text-3xl font-bold ${stat.color} md:text-5xl`}>{stat.value}</p>
              <p className={`text-sm font-medium md:text-base ${style.labelText}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 新纪录提示 */}
        {isNewHighScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-3"
          >
            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-4 py-2 text-base font-bold text-yellow-900 shadow-lg">
              <Icon icon="mdi:trophy" className="text-lg" />
              新纪录！
              <Icon icon="mdi:trophy" className="text-lg" />
            </div>
          </motion.div>
        )}

        {/* 最高分显示 */}
        {highScore !== undefined && highScore > 0 && !isNewHighScore && (
          <div className="mb-3">
            <p className="text-sm font-medium text-amber-600 md:text-base">
              最高分: <span className="font-bold text-amber-800">{highScore}</span>
            </p>
          </div>
        )}

        {/* 按钮 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className={`rounded-full ${style.button} px-6 py-3 text-base font-bold shadow-lg transition-all md:px-8 md:py-4 md:text-xl`}
          >
            再来一次
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExit}
            className={`rounded-full ${style.secondaryButton} px-6 py-3 text-base font-bold shadow-lg transition-all md:px-8 md:py-4 md:text-xl`}
          >
            返回选择
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
