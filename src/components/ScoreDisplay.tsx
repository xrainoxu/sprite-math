import { motion, AnimatePresence } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  showCombo?: boolean;
}

export function ScoreDisplay({ score, streak, showCombo = true }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2 md:gap-2">
      {/* 分数 - 奶白色背景+深紫色文字 */}
      <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 shadow-md md:px-3 md:py-2">
        <span className="text-base md:text-lg">⭐</span>
        <motion.span
          key={score}
          initial={{ scale: 1.2, color: '#fbbf24' }}
          animate={{ scale: 1, color: '#6B21A8' }}
          className="text-base font-bold text-purple-800 md:text-lg"
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
              className="text-base md:text-lg"
            >
              🔥
            </motion.span>
            <span className="text-sm font-bold text-orange-500 md:text-base">
              {streak}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
