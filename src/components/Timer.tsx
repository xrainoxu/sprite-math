import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  seconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function Timer({ seconds, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeUp]);

  const isLow = timeLeft <= 10;

  return (
    <motion.div
      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${
        isLow ? 'bg-red-400 shadow-lg' : 'bg-white shadow-md'
      } md:px-4 md:py-2`}
      animate={isLow ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: isLow ? Infinity : 0, duration: 0.5 }}
    >
      <span className="text-base md:text-lg">{isLow ? '⏰' : '⏱️'}</span>
      <span
        className={`text-base font-bold ${isLow ? 'text-white' : 'text-rose-600'} md:text-lg`}
      >
        {timeLeft}s
      </span>
    </motion.div>
  );
}
