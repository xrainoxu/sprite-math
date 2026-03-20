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
      className={`flex items-center gap-2 rounded-full px-4 py-2 ${
        isLow ? 'bg-red-400 shadow-lg' : 'bg-white shadow-md'
      } md:px-5 md:py-2.5 lg:px-6 lg:py-3`}
      animate={isLow ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: isLow ? Infinity : 0, duration: 0.5 }}
    >
      <span className="text-2xl md:text-3xl lg:text-4xl">{isLow ? '⏰' : '⏱️'}</span>
      <span
        className={`text-2xl font-bold ${isLow ? 'text-white' : 'text-rose-600'} md:text-3xl lg:text-4xl`}
      >
        {timeLeft}s
      </span>
    </motion.div>
  );
}
