import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getStats } from '../utils/storage';
import { Icon } from '../components/Icon';

export function TimedMode() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [highScore, setHighScore] = useState(0);

  const timeOptions = [
    { seconds: 60, minutes: 1 },
    { seconds: 120, minutes: 2 },
    { seconds: 180, minutes: 3 },
    { seconds: 300, minutes: 5 },
  ];

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
        ← {t('timedMode.exit')}
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h1 className="mb-4 text-5xl font-bold text-amber-800">
          <Icon icon="mdi:timer-sand" className="mr-2 vertical-align: middle" />
          {t('timedMode.title')}
        </h1>
        <p className="mb-4 text-xl text-amber-700">
          {t('timedMode.description')}
        </p>

        {/* 时长选择 */}
        <div className="mb-4 flex flex-wrap justify-center gap-3">
          {timeOptions.map((option) => (
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
              style={selectedDuration === option.seconds ? { backgroundColor: '#fbbf24' } : undefined}
            >
              {t('timedMode.minutes', { count: option.minutes })}
            </motion.button>
          ))}
        </div>

        <div className="mb-8 rounded-2xl bg-amber-100/80 border-2 border-amber-300 p-6 shadow-md">
          <p className="text-lg text-amber-900">
            <Icon icon="mdi:trophy" className="mr-2 vertical-align: middle" />
            {t('timedMode.highScore')} <span className="font-bold">{highScore}</span>
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-12 py-4 text-xl font-bold text-white shadow-lg transition-all hover:from-amber-500 hover:to-orange-500"
          style={{ backgroundColor: '#fbbf24' }}
        >
          {t('timedMode.start')}
        </motion.button>
      </motion.div>
    </div>
  );
}
