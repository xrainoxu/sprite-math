import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StatsPanel } from '../components/StatsPanel';
import { getStats } from '../utils/storage';
import { Icon } from '../components/Icon';

export function Home() {
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
          MathFun
        </h1>
        <p className="text-xl text-indigo-500/80">趣味算术训练，提升计算速度</p>
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
          title="计时挑战"
          description="60秒内完成尽可能多的题目"
          color="from-amber-300 to-orange-400"
          onClick={() => navigate('/timed')}
        />

        {/* 闯关模式 - 明快紫粉 */}
        <ModeCard
          icon="mdi:trophy"
          title="闯关模式"
          description="答对积累能量，答错扣血"
          color="from-violet-300 to-fuchsia-400"
          onClick={() => navigate('/challenge')}
        />

        {/* 自由练习 - 清新绿 */}
        <ModeCard
          icon="mdi:target"
          title="自由练习"
          description="选择题型，无压力练习"
          color="from-emerald-300 to-teal-400"
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
        20以内加减法 | 大小判断 | 趣味训练
      </motion.p>
    </div>
  );
}

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

function ModeCard({ icon, title, description, color, onClick }: ModeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${color} p-8 text-left shadow-xl transition-all hover:shadow-2xl`}
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
