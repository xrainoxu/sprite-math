import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import type { QuestionType } from '../utils/math';

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
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['addition', 'subtraction', 'comparison']);

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
    // 通过 URL 参数传递选中的题型
    const typesParam = selectedTypes.join(',');
    navigate(`/practice/play?types=${typesParam}`);
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 md:p-8">
      {/* 退出按钮 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 rounded-full bg-amber-200 px-4 py-2 text-amber-800 shadow-md hover:bg-amber-300"
      >
        ← 退出
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h1 className="mb-4 text-5xl font-bold text-amber-800 md:text-7xl">
          <Icon icon="mdi:target" className="mr-2 vertical-align: middle" />
          自由练习
        </h1>
        <p className="mb-8 text-xl text-amber-700 md:text-2xl">选择想要练习的题目类型</p>

        <div className="mb-8 flex flex-wrap justify-center gap-4 md:gap-6">
          {questionTypes.map((option) => (
            <motion.button
              key={option.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleType(option.type)}
              className={`rounded-2xl border-2 px-8 py-4 text-xl font-bold shadow-lg transition-all md:px-10 md:py-6 md:text-2xl ${
                selectedTypes.includes(option.type)
                  ? 'border-amber-400 bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                  : 'border-amber-300 bg-white text-amber-800 hover:bg-amber-50'
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
            className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-12 py-4 text-xl font-bold text-white shadow-xl transition-all hover:from-amber-500 hover:to-orange-500 md:px-16 md:py-6 md:text-2xl"
          >
            开始练习
          </motion.button>
        ) : (
          <p className="text-amber-600 md:text-xl">请至少选择一种题目类型</p>
        )}
      </motion.div>
    </div>
  );
}
