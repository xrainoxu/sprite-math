import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Timer } from './Timer';
import { ScoreDisplay } from './ScoreDisplay';
import { GameProgressBar } from './GameProgressBar';

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
  /** 进度条当前值 */
  progressValue?: number;
  /** 进度条最大值 */
  progressMax?: number;
  /** 进度条标签 */
  progressLabel?: string;
  /** 主题颜色 */
  theme?: 'rose' | 'violet' | 'orange';
  /** 自定义左侧内容（替换计时器/关卡/生命值） */
  leftContent?: ReactNode;
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
  progressValue,
  progressMax,
  progressLabel = '进度',
  theme = 'rose',
  leftContent,
  rightContent,
}: GameHeaderProps) {
  const themeClasses = {
    rose: {
      bg: 'from-rose-100 to-pink-100',
      exitBtn: 'bg-rose-400 hover:bg-rose-500',
    },
    violet: {
      bg: 'from-violet-100 to-purple-100',
      exitBtn: 'bg-violet-400 hover:bg-violet-500',
    },
    orange: {
      bg: 'from-amber-100 to-orange-100',
      exitBtn: 'bg-orange-400 hover:bg-orange-500',
    },
  };

  const themeStyle = themeClasses[theme];

  // 渲染默认的左侧内容
  const renderDefaultLeftContent = () => {
    // 关卡显示
    if (level) {
      return (
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-white px-3 py-1.5 shadow-md md:px-4 md:py-2">
            <span className={`text-sm font-bold text-${theme === 'orange' ? 'orange' : 'violet'}-700 md:text-base`}>
              第 {level} 关
            </span>
          </div>
          {/* 生命值 */}
          {health !== undefined && (
            <div className="flex gap-0.5">
              {Array.from({ length: maxHealth }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={i < health ? { scale: [1, 1.2, 1] } : {}}
                  className={`text-base md:text-lg ${i < health ? '' : 'opacity-30'}`}
                >
                  ❤️
                </motion.span>
              ))}
            </div>
          )}
        </div>
      );
    }

    // 计时器
    if (timerSeconds && onTimeUp) {
      return <Timer seconds={timerSeconds} onTimeUp={onTimeUp} />;
    }

    return null;
  };

  // 进度条
  const renderProgress = () => {
    if (progressValue === undefined || !progressMax) return null;
    return <GameProgressBar value={progressValue} max={progressMax} label={progressLabel} />;
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-between rounded-b-xl bg-gradient-to-r ${themeStyle.bg} px-2 py-2 shadow-md md:px-3`}
    >
      {/* 左侧：自定义内容或默认的关卡/计时器 */}
      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {leftContent || renderDefaultLeftContent()}
      </div>

      {/* 中间：进度条 */}
      <div className="flex-1 px-1.5 md:px-2">
        {renderProgress()}
      </div>

      {/* 右侧：分数显示 + 退出按钮 */}
      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {rightContent || <ScoreDisplay score={score} streak={streak} />}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className={`rounded-xl ${themeStyle.exitBtn} px-3 py-1.5 text-sm font-bold text-white shadow-md md:px-4 md:py-2 md:text-base`}
        >
          退出
        </motion.button>
      </div>
    </div>
  );
}
