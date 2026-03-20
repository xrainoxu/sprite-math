import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QuestionCard } from '../components/QuestionCard';
import { GameHeader } from '../components/GameHeader';
import { GameOver } from '../components/GameOver';
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
      <GameOver
        title="游戏结束"
        stats={[
          { value: score, label: '得分', color: 'text-amber-600', bgColor: 'bg-amber-100' },
          { value: `${accuracy}%`, label: '正确率', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
          { value: correctCount, label: '答对', color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { value: totalCount, label: '总题数', color: 'text-violet-600', bgColor: 'bg-violet-100' },
        ]}
        isNewHighScore={score >= highScore && score > 0}
        highScore={highScore}
        onRestart={restartGame}
        onExit={() => navigate('/timed')}
        theme="rose"
      />
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
      <div className="flex flex-1 flex-col justify-center overflow-hidden px-2 py-2 md:px-6 md:py-4">
        <AnimatePresence mode="wait">
          {question && (
            <div key={question.id} className="flex flex-col gap-2 md:gap-4">
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
