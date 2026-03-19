import type { Question } from '../utils/math';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  showFeedback?: boolean;
  isCorrect?: boolean;
  selectedAnswer?: string;
  onSelectAnswer?: (answer: string) => void;
}

export function QuestionCard({
  question,
  showFeedback,
  isCorrect,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  const getTypeColor = () => {
    switch (question.type) {
      case 'addition':
        return 'from-green-400 to-emerald-600';
      case 'subtraction':
        return 'from-blue-400 to-indigo-600';
      case 'comparison':
        return 'from-purple-400 to-pink-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getTypeLabel = () => {
    switch (question.type) {
      case 'addition':
        return '➕ 加法';
      case 'subtraction':
        return '➖ 减法';
      case 'comparison':
        return '⚖️ 大小判断';
      default:
        return '❓';
    }
  };

  const renderComparisonQuestion = () => {
    const parts = question.question.split(' ? ');
    const leftExpr = parts[0] || '';
    const rightExpr = parts[1] || '';

    return (
      <div className="flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-6">
        {/* 表达式行 */}
        <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6">
          {/* 左边表达式 */}
          <motion.span
            key={`left-${question.id}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl"
          >
            {leftExpr}
          </motion.span>

          {/* 圆圈占位符 */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white/50 md:h-14 md:w-14 lg:h-16 lg:w-16" />

          {/* 右边表达式 */}
          <motion.span
            key={`right-${question.id}`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl"
          >
            {rightExpr}
          </motion.span>
        </div>

        {/* 符号行 */}
        <div className="flex gap-2 md:gap-4 lg:gap-6">
          {['>', '<', '='].map((op, index) => {
            const isSelected = selectedAnswer === op;
            const isCorrectAnswer = question.answer === op;
            let btnClass = 'bg-white/20 hover:bg-white/30 text-white';
            let labelClass = 'text-white/60';

            if (showFeedback) {
              if (isCorrectAnswer) {
                btnClass = 'bg-green-500 ring-4 ring-green-300';
                labelClass = 'text-green-300';
              } else if (isSelected && !isCorrectAnswer) {
                btnClass = 'bg-red-500 ring-4 ring-red-300';
                labelClass = 'text-red-300';
              }
            } else if (isSelected) {
              btnClass = 'bg-white text-indigo-600 ring-4 ring-white';
              labelClass = 'text-white';
            }

            return (
              <div key={op} className="flex flex-col items-center gap-1 md:gap-2">
                <motion.button
                  whileHover={!showFeedback ? { scale: 1.1 } : {}}
                  whileTap={!showFeedback ? { scale: 0.95 } : {}}
                  onClick={() => !showFeedback && onSelectAnswer?.(op)}
                  disabled={showFeedback}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold transition-all md:h-14 md:w-14 md:text-2xl lg:h-16 lg:w-16 lg:text-3xl ${btnClass} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {op}
                </motion.button>
                <span className={`text-xs md:text-sm ${labelClass}`}>
                  {index === 0 ? '大于' : index === 1 ? '小于' : '等于'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`relative shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br ${getTypeColor()} p-4 shadow-2xl md:p-6 lg:p-8`}
    >
      {/* 装饰性背景圆 */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 md:h-32 md:w-32 lg:h-40 lg:w-40" />
      <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/10 md:h-28 md:w-28 lg:h-32 lg:w-32" />

      {/* 类型标签 */}
      <div className="mb-2 md:mb-4">
        <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm md:px-4 md:py-1 md:text-sm">
          {getTypeLabel()}
        </span>
      </div>

      {/* 题目内容 */}
      <div className="relative flex min-h-[60px] items-center justify-center md:min-h-[80px] lg:min-h-[100px]">
        {question.type === 'comparison' ? (
          renderComparisonQuestion()
        ) : (
          <motion.h2
            key={question.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl"
          >
            {question.question}
          </motion.h2>
        )}

        {/* 答题反馈遮罩 */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 flex items-center justify-center rounded-3xl ${
              isCorrect ? 'bg-green-500/30' : 'bg-red-500/30'
            }`}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl md:text-7xl lg:text-8xl"
            >
              {isCorrect ? '✅' : '❌'}
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
