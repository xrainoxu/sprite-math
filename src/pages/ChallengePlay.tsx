import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QuestionCard } from '../components/QuestionCard';
import { GameHeader } from '../components/GameHeader';
import { GameOver } from '../components/GameOver';
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
  const [wrongCount, setWrongCount] = useState(0);
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
    setWrongCount(0);
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
        setWrongCount((w) => w + 1);
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
    const handleRestart = () => {
      setGameState('playing');
      startGame();
    };

    return (
      <GameOver
        title="游戏结束"
        stats={[
          { value: score, label: '得分', color: 'text-amber-600', bgColor: 'bg-amber-100' },
          { value: level, label: '到达关卡', color: 'text-violet-600', bgColor: 'bg-violet-100' },
          { value: correctCount, label: '答对', color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { value: streak, label: '最高连击', color: 'text-orange-600', bgColor: 'bg-orange-100' },
        ]}
        onRestart={handleRestart}
        onExit={() => navigate('/challenge')}
        theme="violet"
      />
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* 顶部栏 */}
      <GameHeader
        onExit={() => navigate('/challenge')}
        score={score}
        streak={streak}
        level={level}
        health={health}
        maxHealth={MAX_HEALTH}
        progressValue={energy}
        progressMax={MAX_ENERGY}
        progressCorrectCount={correctCount}
        progressWrongCount={wrongCount}
        theme="violet"
      />

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
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
