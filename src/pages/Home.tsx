import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { StatsPanel } from '../components/StatsPanel';
import { getStats } from '../utils/storage';
import { Icon } from '../components/Icon';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stats = getStats();

  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* 标题 */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-6xl font-bold text-indigo-600 drop-shadow-sm">
          <Icon icon="mdi:calculator-variant" className="mr-3 text-5xl vertical-align: middle" />
          {t('app.title')}
        </h1>
        <p className="text-xl text-indigo-500/80">{t('app.subtitle')}</p>
      </motion.div>

      {/* 统计面板 */}
      <div className="mb-12">
        <StatsPanel stats={stats} />
      </div>

      {/* 模式选择 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {/* 计时挑战 - 明亮橙黄 */}
        <ModeCard
          icon="mdi:timer-sand"
          title={t('home.timedChallenge')}
          description={t('home.timedDescription')}
          color="from-amber-300 to-orange-400"
          fallbackBg="#fcd34d"
          onClick={() => navigate('/timed')}
        />

        {/* 闯关模式 - 明快紫粉 */}
        <ModeCard
          icon="mdi:trophy"
          title={t('home.challengeMode')}
          description={t('home.challengeDescription')}
          color="from-violet-300 to-fuchsia-400"
          fallbackBg="#c4b5fd"
          onClick={() => navigate('/challenge')}
        />

        {/* 自由练习 - 清新绿 */}
        <ModeCard
          icon="mdi:target"
          title={t('home.practiceMode')}
          description={t('home.practiceDescription')}
          color="from-emerald-300 to-teal-400"
          fallbackBg="#6ee7b7"
          onClick={() => navigate('/practice')}
        />
      </motion.div>

      {/* 底部说明 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-indigo-400/60"
      >
        {t('app.footer')}
      </motion.p>
    </div>
  );
}

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  fallbackBg: string;
  onClick: () => void;
}

function ModeCard({ icon, title, description, color, fallbackBg, onClick }: ModeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${color} p-8 text-left shadow-xl transition-all hover:shadow-2xl`}
      style={{ backgroundColor: fallbackBg }}
    >
      {/* 装饰性背景 */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20" />
      <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-white/10" />

      <div className="relative">
        <Icon icon={icon} className="mb-4 block text-5xl text-white" />
        <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </motion.button>
  );
}
