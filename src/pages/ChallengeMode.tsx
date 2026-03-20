import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Icon } from '../components/Icon';

const MAX_HEALTH = 3;
const MAX_ENERGY = 100;

export function ChallengeMode() {
  const { t } = useTranslation();
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
        className="absolute left-4 top-4 rounded-full bg-amber-200 px-4 py-2 text-amber-800 shadow-md hover:bg-amber-300"
      >
        ← {t('challengeMode.exit')}
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h1 className="mb-4 text-5xl font-bold text-amber-800">
          <Icon icon="mdi:trophy" className="mr-2 vertical-align: middle" />
          {t('challengeMode.title')}
        </h1>
        <p className="mb-8 text-xl text-amber-700">
          {t('challengeMode.description')}
        </p>
        <div className="mb-8 space-y-4 rounded-2xl bg-amber-100/80 border-2 border-amber-300 p-6 shadow-md">
          <p className="text-lg text-amber-900">
            <Icon icon="mdi:heart" className="mr-2 vertical-align: middle" />
            {t('challengeMode.health')} <span className="font-bold">{MAX_HEALTH}</span>
          </p>
          <p className="text-lg text-amber-900">
            <Icon icon="mdi:lightning-bolt" className="mr-2 vertical-align: middle" />
            {t('challengeMode.energy')} <span className="font-bold">{MAX_ENERGY}%</span> {t('challengeMode.levelUp')}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-12 py-4 text-xl font-bold text-white shadow-lg transition-all hover:from-amber-500 hover:to-orange-500"
          style={{ backgroundColor: '#fbbf24' }}
        >
          {t('challengeMode.start')}
        </motion.button>
      </motion.div>
    </div>
  );
}
