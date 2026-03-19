import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerInput } from '../components/AnswerInput';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { generateQuestion, checkAnswer } from '../utils/math';
import type { Question, QuestionType } from '../utils/math';
import { recordAnswer } from '../utils/storage';
import { playCorrectSound, playWrongSound } from '../utils/sound';

interface QuestionTypeOption {
  type: QuestionType;
  label: string;
  icon: string;
}

const questionTypes: QuestionTypeOption[] = [
  { type: 'addition', label: '加法', icon: '➕' },
  { type: 'subtraction', label: '减法', icon: '➖' },
  { type: 'comparison', label: '大小', icon: '⚖️' },
];

export function PracticeMode() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'select' | 'playing'>('select');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['addition', 'subtraction', 'comparison']);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({
    show: false,
    isCorrect: false,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const toggleType = (type: QuestionType) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  const startPractice = () => {
    if (selectedTypes.length === 0) return;
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalCount(0);
    setQuestion(generateQuestion(selectedTypes));
    setFeedback({ show: false, isCorrect: false });
    setSelectedAnswer('');
  };

  const handleAnswer = useCallback(
    (answer: number | string) => {
      if (!question || feedback.show) return;

      const isCorrect = checkAnswer(question, answer);
      setFeedback({ show: true, isCorrect });

      if (isCorrect) {
        playCorrectSound();
        setScore((s) => s + 10 + streak * 2);
        setStreak((s) => s + 1);
        setCorrectCount((c) => c + 1);
      } else {
        playWrongSound();
        setStreak(0);
      }

      setTotalCount((t) => t + 1);
      recordAnswer(isCorrect, 'practice');

      setTimeout(() => {
        setQuestion(generateQuestion(selectedTypes));
        setFeedback({ show: false, isCorrect: false });
        setSelectedAnswer('');
      }, 500);
    },
    [question, feedback.show, streak, selectedTypes]
  );

  const handleSelectAnswer = useCallback((answer: string) => {
    if (!question || feedback.show) return;
    setSelectedAnswer(answer);
    handleAnswer(answer);
  }, [question, feedback.show, handleAnswer]);

  if (gameState === 'select') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        {/* 退出按钮 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm hover:bg-white/30"
        >
          ← 退出
        </motion.button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h1 className="mb-4 text-5xl font-bold text-white md:text-7xl">🎯 自由练习</h1>
          <p className="mb-8 text-xl text-white/80 md:text-2xl">选择想要练习的题目类型</p>

          <div className="mb-8 flex flex-wrap justify-center gap-4 md:gap-6">
            {questionTypes.map((option) => (
              <motion.button
                key={option.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleType(option.type)}
                className={`rounded-2xl px-8 py-4 text-xl font-bold shadow-lg transition-all md:px-10 md:py-6 md:text-2xl ${
                  selectedTypes.includes(option.type)
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white/60 hover:bg-white/30'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </motion.button>
            ))}
          </div>

          {selectedTypes.length > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startPractice}
              className="rounded-full bg-white px-12 py-4 text-xl font-bold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 md:px-16 md:py-6 md:text-2xl"
            >
              开始练习
            </motion.button>
          ) : (
            <p className="text-white/60 md:text-xl">请至少选择一种题目类型</p>
          )}
        </motion.div>
      </div>
    );
  }

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* 顶部栏 */}
      <div className="flex shrink-0 items-center justify-between px-2 py-2 md:px-4 md:py-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="rounded-full bg-white/20 px-2 py-1.5 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/30 md:px-3 md:py-2 md:text-base"
        >
          退出
        </motion.button>

        <ScoreDisplay score={score} streak={streak} />

        <div className="rounded-full bg-white/20 px-2 py-1.5 backdrop-blur-sm md:px-3 md:py-2">
          <span className="font-bold text-white md:text-lg">{accuracy}%</span>
        </div>
      </div>

      {/* 中间区域 - 题目和答题区，不滚动 */}
      <div className="flex flex-1 flex-col justify-center overflow-hidden px-2 md:px-6">
        <AnimatePresence mode="wait">
          {question && (
            <div key={question.id} className="flex flex-col gap-3 md:gap-4">
              <QuestionCard
                question={question}
                showFeedback={feedback.show}
                isCorrect={feedback.isCorrect}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleSelectAnswer}
              />
              <AnswerInput
                question={question}
                onAnswer={handleAnswer}
                disabled={feedback.show}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部统计，不遮挡答题区 */}
      <div className="shrink-0 px-2 py-2 md:px-4 md:py-3">
        <div className="text-center text-xs text-white/60 md:text-sm">
          已答题: {totalCount} | 正确: {correctCount}
        </div>
      </div>
    </div>
  );
}
