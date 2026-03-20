import { motion, AnimatePresence } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  showCombo?: boolean;
}

export function ScoreDisplay({ score, streak, showCombo = true }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      {/* 分数 - 奶白色背景+深紫色文字，突出醒目 */}
      <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-md md:px-5 md:py-3">
        <span className="text-3xl md:text-4xl lg:text-5xl">⭐</span>
        <motion.span
          key={score}
          initial={{ scale: 1.3, color: '#fbbf24' }}
          animate={{ scale: 1, color: '#6B21A8' }}
          className="text-3xl font-bold text-purple-800 md:text-4xl lg:text-5xl"
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
              className="text-2xl md:text-3xl lg:text-4xl"
            >
              🔥
            </motion.span>
            <span className="text-xl font-bold text-orange-500 md:text-2xl lg:text-3xl">
              {streak} 连击!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
