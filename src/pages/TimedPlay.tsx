import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QuestionCard } from '../components/QuestionCard';
import { GameHeader } from '../components/GameHeader';
import { generateQuestion, checkAnswer } from '../utils/math';
import type { Question } from '../utils/math';
import { updateHighestScore, recordAnswer } from '../utils/storage';
import {
  playCorrectSound,
  playWrongSound,
  playComboSound,
  playGameOverSound,
} from '../utils/sound';

interface Feedback {
  show: boolean;
  isCorrect: boolean;
}

export function TimedPlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const duration = Number(searchParams.get('duration')) || 60;
  // 根据时间推导题目数量: 1分钟=50, 2分钟=100, 3分钟=150, 5分钟=250
  const questionTarget = Math.floor((duration / 60) * 50);

  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ show: false, isCorrect: false });
  const [highScore, setHighScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [gameDuration] = useState(duration);

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('mathfun_stats') || '{"highestScore":0}');
    setHighScore(stats.highestScore || 0);
  }, []);

  useEffect(() => {
    setQuestion(generateQuestion());
    setFeedback({ show: false, isCorrect: false });
  }, []);

  const handleTimeUp = useCallback(() => {
    setGameState('finished');
    playGameOverSound();
    const stats = updateHighestScore(score);
    setHighScore(stats.highestScore);
  }, [score]);

  const handleAnswer = useCallback(
    (answer: number | string) => {
      if (!question || feedback.show) return;

      const isCorrect = checkAnswer(question, answer);
      setFeedback({ show: true, isCorrect });

      let newTotalCount = totalCount + 1;

      if (isCorrect) {
        playCorrectSound();
        setScore((s) => s + 10 + streak * 2);
        setStreak((s) => s + 1);
        setCorrectCount((c) => c + 1);

        if (streak > 0 && streak % 3 === 0) {
          playComboSound(streak);
        }
      } else {
        playWrongSound();
        setStreak(0);
      }

      setTotalCount((t) => t + 1);
      recordAnswer(isCorrect, 'timed');

      // 检查是否达到目标题目数量
      if (newTotalCount >= questionTarget) {
        setTimeout(() => {
          setGameState('finished');
          playGameOverSound();
          const stats = updateHighestScore(score + (isCorrect ? 10 + streak * 2 : 0));
          setHighScore(stats.highestScore);
        }, 500);
        return;
      }

      setTimeout(() => {
        setQuestion(generateQuestion());
        setFeedback({ show: false, isCorrect: false });
        setSelectedAnswer('');
      }, 500);
    },
    [question, feedback.show, streak, totalCount, questionTarget, score]
  );

  const handleSelectAnswer = useCallback((answer: string) => {
    if (!question || feedback.show) return;
    setSelectedAnswer(answer);
    handleAnswer(answer);
  }, [question, feedback.show, handleAnswer]);

  const restartGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalCount(0);
    setQuestion(generateQuestion());
    setFeedback({ show: false, isCorrect: false });
    setSelectedAnswer('');
  };

  if (gameState === 'finished') {
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">游戏结束!</h1>
          <div className="mb-8 grid grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-2xl bg-yellow-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{score}</p>
              <p className="text-white/80 md:text-xl">得分</p>
            </div>
            <div className="rounded-2xl bg-green-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{accuracy}%</p>
              <p className="text-white/80 md:text-xl">正确率</p>
            </div>
            <div className="rounded-2xl bg-blue-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{correctCount}</p>
              <p className="text-white/80 md:text-xl">答对</p>
            </div>
            <div className="rounded-2xl bg-purple-500/30 p-6 backdrop-blur-sm md:p-8">
              <p className="text-4xl font-bold text-white md:text-6xl">{totalCount}</p>
              <p className="text-white/80 md:text-xl">总题数</p>
            </div>
          </div>
          {score >= highScore && score > 0 && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6 text-2xl font-bold text-yellow-300 md:text-4xl"
            >
              🎉 新纪录！🎉
            </motion.p>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="rounded-full bg-white px-8 py-4 text-xl font-bold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50 md:px-12 md:py-6 md:text-2xl"
            >
              再来一次
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/timed')}
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
      <GameHeader
        onExit={() => navigate('/timed')}
        timerSeconds={gameDuration}
        onTimeUp={handleTimeUp}
        score={score}
        streak={streak}
        progressValue={totalCount}
        progressMax={questionTarget}
        progressCorrectCount={correctCount}
        progressWrongCount={totalCount - correctCount}
        theme="rose"
      />

      {/* 中间区域 - 题目和答题区自适应高度，不滚动 */}
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
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
