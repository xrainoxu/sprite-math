import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStats } from '../utils/storage';
import { Icon } from '../components/Icon';

const TIME_OPTIONS = [
  { seconds: 60, label: '1分钟' },
  { seconds: 120, label: '2分钟' },
  { seconds: 180, label: '3分钟' },
  { seconds: 300, label: '5分钟' },
];

export function TimedMode() {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stats = getStats();
    setHighScore(stats.highestScore || 0);
  }, []);

  const startGame = () => {
    navigate(`/timed/play?duration=${selectedDuration}`);
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
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
        <h1 className="mb-4 text-5xl font-bold text-amber-800">
          <Icon icon="mdi:timer-sand" className="mr-2 vertical-align: middle" />
          计时挑战
        </h1>
        <p className="mb-4 text-xl text-amber-700">
          选择时长，完成尽可能多的题目！
        </p>

        {/* 时长选择 */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {TIME_OPTIONS.map((option) => (
            <motion.button
              key={option.seconds}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDuration(option.seconds)}
              className={`rounded-2xl border-2 px-6 py-3 text-lg font-bold shadow-lg transition-all ${
                selectedDuration === option.seconds
                  ? 'border-amber-400 bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                  : 'border-amber-300 bg-white text-amber-800 hover:bg-amber-50'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        <div className="mb-8 rounded-2xl bg-amber-100/80 border-2 border-amber-300 p-6 shadow-md">
          <p className="text-lg text-amber-900">
            <Icon icon="mdi:trophy" className="mr-2 vertical-align: middle" />
            最高分: <span className="font-bold">{highScore}</span>
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-12 py-4 text-xl font-bold text-white shadow-lg transition-all hover:from-amber-500 hover:to-orange-500"
        >
          开始挑战
        </motion.button>
      </motion.div>
    </div>
  );
}
