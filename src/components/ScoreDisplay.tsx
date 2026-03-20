import { motion, AnimatePresence } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  showCombo?: boolean;
}

export function ScoreDisplay({ score, streak, showCombo = true }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* 分数 - 奶白色背景+深紫色文字，突出醒目 */}
      <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 shadow-md md:px-4 md:py-2">
        <span className="text-xl md:text-2xl lg:text-3xl">⭐</span>
        <motion.span
          key={score}
          initial={{ scale: 1.3, color: '#fbbf24' }}
          animate={{ scale: 1, color: '#6B21A8' }}
          className="text-xl font-bold text-purple-800 md:text-2xl lg:text-3xl"
        >
          {score}
        </motion.span>
      </div>

      {/* 连击 */}
      <AnimatePresence>
        {showCombo && streak > 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-1"
          >
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-lg md:text-xl lg:text-2xl"
            >
              🔥
            </motion.span>
            <span className="text-base font-bold text-orange-500 md:text-lg lg:text-xl">
              {streak} 连击!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
