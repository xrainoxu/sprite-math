import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../utils/math';

interface AnswerInputProps {
  question: Question;
  onAnswer: (answer: number | string) => void;
  disabled?: boolean;
}

export function AnswerInput({ question, onAnswer, disabled }: AnswerInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦输入框（仅对加减法）
  useEffect(() => {
    if (!disabled && question.type !== 'comparison') {
      inputRef.current?.focus();
    }
  }, [question.id, disabled, question.type]);

  // 题目类型变化时清空输入
  useEffect(() => {
    setValue('');
  }, [question.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onAnswer(value.trim());
      setValue('');
    }
  };

  // 大小判断题在 QuestionCard 中已经显示了圆形按钮，这里不需要再显示
  if (question.type === 'comparison') {
    return null;
  }

  // 数字输入框（加减法）
  return (
    <motion.form
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onSubmit={handleSubmit}
      className="mt-2 flex justify-center md:mt-3 lg:mt-4"
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder="?"
          className="h-16 w-32 rounded-2xl border-4 border-purple-200 bg-white px-4 text-center text-4xl font-bold text-purple-700 shadow-xl placeholder:text-purple-300 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/50 disabled:cursor-not-allowed disabled:bg-gray-100 md:h-20 md:w-40 md:text-5xl lg:h-24 lg:w-48 lg:text-6xl"
        />
        <motion.button
          type="submit"
          disabled={disabled || !value.trim()}
          whileHover={{ scale: disabled || !value.trim() ? 1 : 1.05 }}
          whileTap={{ scale: disabled || !value.trim() ? 1 : 0.95 }}
          className="mt-2 flex w-full justify-center rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 px-4 py-2 text-base font-bold text-white shadow-lg transition-all hover:from-orange-500 hover:to-amber-500 disabled:cursor-not-allowed disabled:bg-gray-300 md:mt-3 md:px-6 md:py-3 md:text-lg lg:mt-4 lg:px-8 lg:py-4 lg:text-xl"
        >
          提交答案
        </motion.button>
      </div>
    </motion.form>
  );
}
