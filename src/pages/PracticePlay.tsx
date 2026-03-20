import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerInput } from '../components/AnswerInput';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { GameHeader } from '../components/GameHeader';
import { generateQuestion, checkAnswer } from '../utils/math';
import type { Question, QuestionType } from '../utils/math';
import { recordAnswer } from '../utils/storage';
import { playCorrectSound, playWrongSound } from '../utils/sound';

interface Feedback {
  show: boolean;
  isCorrect: boolean;
}

export function PracticePlay() {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 URL 参数获取选中的题型
  const typesParam = new URLSearchParams(location.search).get('types');
  const selectedTypesRef = useRef<QuestionType[]>(
    typesParam
      ? (typesParam.split(',') as QuestionType[])
      : ['addition', 'subtraction', 'comparison']
  );

  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ show: false, isCorrect: false });
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const isInitialized = useRef(false);

  // 只在组件挂载时生成第一题
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      setQuestion(generateQuestion(selectedTypesRef.current));
      setFeedback({ show: false, isCorrect: false });
    }
  }, []);

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
        setQuestion(generateQuestion(selectedTypesRef.current));
        setFeedback({ show: false, isCorrect: false });
        setSelectedAnswer('');
      }, 500);
    },
    [question, feedback.show, streak]
  );

  const handleSelectAnswer = useCallback((answer: string) => {
    if (!question || feedback.show) return;
    setSelectedAnswer(answer);
    handleAnswer(answer);
  }, [question, feedback.show, handleAnswer]);

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* 顶部栏 */}
      <GameHeader
        onExit={() => navigate('/practice')}
        score={score}
        streak={streak}
        progressValue={correctCount}
        progressMax={totalCount || 1}
        theme="orange"
        leftContent={
          <div className="rounded-full bg-white px-3 py-1.5 shadow-md md:px-4 md:py-2">
            <span className="font-bold text-orange-600 md:text-lg">{accuracy}%</span>
          </div>
        }
        rightContent={<ScoreDisplay score={score} streak={streak} />}
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
              <AnswerInput
                question={question}
                onAnswer={handleAnswer}
                disabled={feedback.show}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
