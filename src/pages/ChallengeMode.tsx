import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MAX_HEALTH = 3;
const MAX_ENERGY = 100;

export function ChallengeMode() {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/challenge/play');
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
        className="absolute left-4 top-4 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm hover:bg-white/30"
      >
        ← 退出
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h1 className="mb-4 text-5xl font-bold text-white">🏆 闯关模式</h1>
        <p className="mb-8 text-xl text-white/80">
          答对积累能量，答错扣血！坚持到最后！
        </p>
        <div className="mb-8 space-y-4 rounded-2xl bg-white/20 p-6 backdrop-blur-sm">
          <p className="text-lg text-white">
            ❤️ 生命值: <span className="font-bold">{MAX_HEALTH}</span>
          </p>
          <p className="text-lg text-white">
            ⚡ 能量满: <span className="font-bold">{MAX_ENERGY}%</span> 升级
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="rounded-full bg-white px-12 py-4 text-xl font-bold text-indigo-600 shadow-xl transition-all hover:bg-indigo-50"
        >
          开始闯关
        </motion.button>
      </motion.div>
    </div>
  );
}
