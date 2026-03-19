import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerInput } from '../components/AnswerInput';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { ProgressBar } from '../components/ProgressBar';
import { generateQuestion, checkAnswer } from '../utils/math';
import type { Question } from '../utils/math';
import { updateLongestStreak, recordAnswer } from '../utils/storage';
import {
  playCorrectSound,
  playWrongSound,
  playComboSound,
  playVictorySound,
} from '../utils/sound';

const MAX_HEALTH = 3;
const MAX_ENERGY = 100;
const ENERGY_PER_CORRECT = 15;

export function ChallengePlay() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [energy, setEnergy] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ show: boolean; isCorrect: boolean }>({
    show: false,
    isCorrect: false,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setHealth(MAX_HEALTH);
    setEnergy(0);
    setLevel(1);
    setCorrectCount(0);
    setQuestion(generateQuestion());
    setFeedback({ show: false, isCorrect: false });
    setSelectedAnswer('');
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('finished');
    playWrongSound();
    updateLongestStreak(streak);
  }, [streak]);

  const handleLevelUp = useCallback(() => {
    playVictorySound();
    setLevel((l) => l + 1);
    setEnergy(0);
    setHealth((h) => Math.min(h + 1, MAX_HEALTH));
  }, []);

  const handleAnswer = useCallback(
    (answer: number | string) => {
      if (!question || feedback.show) return;

      const isCorrect = checkAnswer(question, answer);
      setFeedback({ show: true, isCorrect });

      if (isCorrect) {
        playCorrectSound();
        setScore((s) => s + 10 + level * 2 + streak * 2);
        setStreak((s) => s + 1);
        setCorrectCount((c) => c + 1);

        setEnergy((e) => {
          const newEnergy = e + ENERGY_PER_CORRECT;
          if (newEnergy >= MAX_ENERGY) {
            handleLevelUp();
            return 0;
          }
          return newEnergy;
        });

        if (streak > 0 && streak % 3 === 0) {
          playComboSound(streak);
        }
      } else {
        playWrongSound();
        setStreak(0);
        setHealth((h) => {
          const newHealth = h - 1;
          if (newHealth <= 0) {
            handleGameOver();
            return 0;
          }
          return newHealth;
        });
      }

      recordAnswer(isCorrect, 'challenge');

      setTimeout(() => {
        setQuestion(generateQuestion());
        setFeedback({ show: false, isCorrect: false });
        setSelectedAnswer('');
      }, 500);
    },
    [question, feedback.show, streak, level, handleLevelUp, handleGameOver]
  );

  const handleSelectAnswer = useCallback((answer: string) => {
    if (!question || feedback.show) return;
    setSelectedAnswer(answer);
    handleAnswer(answer);
  }, [question, feedback.show, handleAnswer]);

  if (gameState === 'finished') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">游戏结束</h1>
          <div className="mb-8 grid grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-2xl bg-yellow-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{score}</p>
              <p className="text-white/80 md:text-xl">得分</p>
            </div>
            <div className="rounded-2xl bg-purple-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{level}</p>
              <p className="text-white/80 md:text-xl">到达关卡</p>
            </div>
            <div className="rounded-2xl bg-blue-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{correctCount}</p>
              <p className="text-white/80 md:text-xl">答对</p>
            </div>
            <div className="rounded-2xl bg-orange-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{streak}</p>
              <p className="text-white/80 md:text-xl">最高连击</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setGameState('playing');
                startGame();
              }}
              className="rounded-full bg-white px-8 py-4 text-xl font-bold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 md:px-12 md:py-6 md:text-2xl"
            >
              再来一次
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/challenge')}
              className="rounded-full bg-white/20 px-8 py-4 text-xl font-bold text-white shadow-xl transition-all hover:bg-white/30 md:px-12 md:py-6 md:text-2xl"
            >
              返回选择
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* 顶部栏 */}
      <div className="flex shrink-0 items-center justify-between px-2 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-2 md:gap-3">
          {/* 生命值 */}
          <div className="flex gap-0.5">
            {Array.from({ length: MAX_HEALTH }).map((_, i) => (
              <motion.span
                key={i}
                animate={i < health ? { scale: [1, 1.2, 1] } : {}}
                className={`text-xl md:text-2xl lg:text-3xl ${i < health ? '' : 'opacity-30'}`}
              >
                ❤️
              </motion.span>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/challenge')}
            className="rounded-full bg-white/20 px-2 py-1.5 text-sm text-white backdrop-blur-sm hover:bg-white/30 md:px-3 md:py-2 md:text-base"
          >
            退出
          </motion.button>
        </div>

        {/* 关卡 */}
        <div className="rounded-full bg-white/20 px-2 py-1.5 backdrop-blur-sm md:px-3 md:py-2">
          <span className="text-base font-bold text-white md:text-lg lg:text-xl">第 {level} 关</span>
        </div>

        <ScoreDisplay score={score} streak={streak} />
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

      {/* 底部 - 能量条，不遮挡答题区 */}
      <div className="shrink-0 px-2 py-2 md:px-4 md:py-3">
        <ProgressBar
          value={energy}
          max={MAX_ENERGY}
          color="purple"
          showLabel={true}
        />
      </div>
    </div>
  );
}
