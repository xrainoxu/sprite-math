import type { Question } from '../utils/math';
import { motion } from 'framer-motion';
import { Icon } from './Icon';

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
  // 卡通明亮配色
  const getTypeColor = () => {
    switch (question.type) {
      case 'addition':
        return 'from-emerald-300 to-teal-500';
      case 'subtraction':
        return 'from-sky-300 to-blue-500';
      case 'comparison':
        return 'from-violet-300 to-fuchsia-500';
      default:
        return 'from-slate-300 to-slate-500';
    }
  };

  const getTypeIcon = () => {
    switch (question.type) {
      case 'addition':
        return 'mdi:plus';
      case 'subtraction':
        return 'mdi:minus';
      case 'comparison':
        return 'mdi:scale-balance';
      default:
        return 'mdi:help';
    }
  };

  const getTypeLabel = () => {
    switch (question.type) {
      case 'addition':
        return '加法';
      case 'subtraction':
        return '减法';
      case 'comparison':
        return '大小判断';
      default:
        return '题目';
    }
  };

  // 处理加减法的数字选择
  const handleNumberSelect = (num: number) => {
    if (!showFeedback) {
      onSelectAnswer?.(String(num));
    }
  };

  // 生成答案选项 (0-30)
  const answerOptions = Array.from({ length: 31 }, (_, i) => i);

  const renderCalculationQuestion = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-3 md:gap-6 lg:gap-10">
        {/* 题目表达式 */}
        <motion.h2
          key={question.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center text-5xl font-bold text-white drop-shadow-lg md:text-7xl lg:text-8xl"
        >
          {question.question}
        </motion.h2>

        {/* 答案选项按钮 - 平铺显示 */}
        <div className="grid grid-cols-7 md:grid-cols-11 gap-2 md:gap-3">
          {answerOptions.map((num) => {
            const isSelected = selectedAnswer === String(num);
            const isCorrectAnswer = question.answer === String(num);
            let btnClass = 'bg-white/30 hover:bg-white/50 text-white ring-2 ring-white/30';

            if (showFeedback) {
              if (isCorrectAnswer) {
                btnClass = 'bg-green-400 ring-4 ring-green-200 text-white';
              } else if (isSelected && !isCorrectAnswer) {
                btnClass = 'bg-red-400 ring-4 ring-red-200 text-white';
              }
            } else if (isSelected) {
              btnClass = 'bg-white text-purple-600 ring-4 ring-purple-300';
            }

            return (
              <motion.button
                key={num}
                type="button"
                whileHover={!showFeedback ? { scale: 1.05 } : {}}
                whileTap={!showFeedback ? { scale: 0.95 } : {}}
                onClick={() => !showFeedback && handleNumberSelect(num)}
                disabled={showFeedback}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-md transition-all md:h-14 md:w-14 md:text-xl lg:h-16 lg:w-16 lg:text-2xl ${btnClass} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {num}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderComparisonQuestion = () => {
    const parts = question.question.split(' ? ');
    const leftExpr = parts[0] || '';
    const rightExpr = parts[1] || '';

    return (
      <div className="flex flex-col items-center justify-center gap-3 md:gap-6 lg:gap-10">
        {/* 表达式行 */}
        <div className="flex items-center justify-center gap-2 md:gap-6 lg:gap-10">
          {/* 左边表达式 */}
          <motion.span
            key={`left-${question.id}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl"
          >
            {leftExpr}
          </motion.span>

          {/* 圆圈占位符 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white/50 md:h-20 md:w-20 lg:h-24 lg:w-24" />

          {/* 右边表达式 */}
          <motion.span
            key={`right-${question.id}`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl"
          >
            {rightExpr}
          </motion.span>
        </div>

        {/* 符号行 */}
        <div className="flex gap-4 md:gap-6 lg:gap-10">
          {['>', '<', '='].map((op, index) => {
            const isSelected = selectedAnswer === op;
            const isCorrectAnswer = question.answer === op;
            let btnClass = 'bg-white/30 hover:bg-white/50 text-white ring-2 ring-white/30';
            let labelClass = 'text-white/80';

            if (showFeedback) {
              if (isCorrectAnswer) {
                btnClass = 'bg-green-400 ring-4 ring-green-200';
                labelClass = 'text-green-700 font-bold';
              } else if (isSelected && !isCorrectAnswer) {
                btnClass = 'bg-red-400 ring-4 ring-red-200';
                labelClass = 'text-red-700 font-bold';
              }
            } else if (isSelected) {
              btnClass = 'bg-white text-purple-600 ring-4 ring-purple-300';
              labelClass = 'text-white font-bold';
            }

            return (
              <div key={op} className="flex flex-col items-center gap-1 md:gap-3">
                <motion.button
                  whileHover={!showFeedback ? { scale: 1.1 } : {}}
                  whileTap={!showFeedback ? { scale: 0.95 } : {}}
                  onClick={() => !showFeedback && onSelectAnswer?.(op)}
                  disabled={showFeedback}
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold transition-all md:h-24 md:w-24 md:text-4xl lg:h-28 lg:w-28 lg:text-5xl ${btnClass} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {showFeedback && isCorrectAnswer ? op : op}
                </motion.button>
                <span className={`text-sm md:text-lg ${labelClass}`}>
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
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`relative shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br ${getTypeColor()} p-6 shadow-2xl md:p-8 lg:p-12`}
      >
        {/* 装饰性背景圆 */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 md:h-32 md:w-32 lg:h-40 lg:w-40" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/10 md:h-28 md:w-28 lg:h-32 lg:w-32" />

        {/* 类型标签 */}
        <div className="mb-3 md:mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/30 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm md:px-4 md:py-1 md:text-sm">
            <Icon icon={getTypeIcon()} className="text-sm" />
            {getTypeLabel()}
          </span>
        </div>

        {/* 题目内容 */}
        <div className="relative flex min-h-[100px] items-center justify-center py-2 md:min-h-[140px] md:py-0 lg:min-h-[180px]">
          {question.type === 'comparison'
            ? renderComparisonQuestion()
            : renderCalculationQuestion()}

          {/* 答题反馈遮罩 */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute inset-0 flex items-center justify-center rounded-3xl ${
                isCorrect ? 'bg-emerald-400/40' : 'bg-rose-400/40'
              }`}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-5xl md:text-7xl lg:text-8xl"
              >
                <Icon icon={isCorrect ? 'mdi:check-circle' : 'mdi:close-circle'} className="text-white" />
              </motion.span>
            </motion.div>
          )}
        </div>
      </motion.div>

    </>
  );
}
