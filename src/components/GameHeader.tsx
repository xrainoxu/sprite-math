import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Timer } from './Timer';
import { ScoreDisplay } from './ScoreDisplay';

interface GameHeaderProps {
  /** 退出按钮回调 */
  onExit: () => void;
  /** 计时器倒计时秒数（不传则不显示计时器） */
  timerSeconds?: number;
  /** 计时器结束回调 */
  onTimeUp?: () => void;
  /** 当前分数 */
  score: number;
  /** 当前连击数 */
  streak: number;
  /** 当前关卡（不传则不显示） */
  level?: number;
  /** 当前生命值（不传则不显示） */
  health?: number;
  /** 最大生命值 */
  maxHealth?: number;
  /** 当前能量值（不传则不显示） */
  energy?: number;
  /** 最大能量值 */
  maxEnergy?: number;
  /** 主题颜色 */
  theme?: 'rose' | 'violet' | 'orange';
  /** 自定义右侧内容（替换默认的分数显示） */
  rightContent?: ReactNode;
}

export function GameHeader({
  onExit,
  timerSeconds,
  onTimeUp,
  score,
  streak,
  level,
  health,
  maxHealth = 3,
  energy,
  maxEnergy = 100,
  theme = 'rose',
  rightContent,
}: GameHeaderProps) {
  const themeClasses = {
    rose: {
      bg: 'from-rose-100 to-pink-100',
      exitBtn: 'bg-rose-400 hover:bg-rose-500',
      levelBg: 'bg-white',
      levelText: 'text-rose-700',
    },
    violet: {
      bg: 'from-violet-100 to-purple-100',
      exitBtn: 'bg-violet-400 hover:bg-violet-500',
      levelBg: 'bg-white',
      levelText: 'text-violet-700',
    },
    orange: {
      bg: 'from-amber-100 to-orange-100',
      exitBtn: 'bg-orange-400 hover:bg-orange-500',
      levelBg: 'bg-white',
      levelText: 'text-orange-600',
    },
  };

  const themeStyle = themeClasses[theme];

  return (
    <div
      className={`flex shrink-0 items-center justify-between rounded-b-2xl bg-gradient-to-r ${themeStyle.bg} px-3 py-2 shadow-md md:px-4 md:py-2`}
    >
      {/* 左侧：退出按钮 + 计时器/生命值 */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* 退出按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className={`rounded-full ${themeStyle.exitBtn} px-3 py-1.5 text-sm font-bold text-white shadow-md md:px-4 md:py-2 md:text-base`}
        >
          退出
        </motion.button>

        {/* 计时器 */}
        {timerSeconds && onTimeUp && (
          <Timer seconds={timerSeconds} onTimeUp={onTimeUp} />
        )}

        {/* 生命值 */}
        {health !== undefined && (
          <div className="flex gap-0.5">
            {Array.from({ length: maxHealth }).map((_, i) => (
              <motion.span
                key={i}
                animate={i < health ? { scale: [1, 1.2, 1] } : {}}
                className={`text-lg md:text-xl lg:text-2xl ${i < health ? '' : 'opacity-30'}`}
              >
                ❤️
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* 中间：关卡显示 */}
      {level && (
        <div className={`rounded-full ${themeStyle.levelBg} px-3 py-1 shadow-md md:px-4 md:py-2`}>
          <span className={`text-sm font-bold ${themeStyle.levelText} md:text-base lg:text-lg`}>
            第 {level} 关
          </span>
        </div>
      )}

      {/* 右侧：自定义内容或分数显示 */}
      {rightContent || <ScoreDisplay score={score} streak={streak} />}
    </div>
  );
}
