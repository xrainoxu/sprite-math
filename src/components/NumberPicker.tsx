import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';

interface NumberPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (num: number) => void;
  minNumber?: number;
  maxNumber?: number;
  title?: string;
}

export function NumberPicker({
  isOpen,
  onClose,
  onSelect,
  minNumber = 0,
  maxNumber = 20,
  title = '请选择答案',
}: NumberPickerProps) {
  // 生成数字数组
  const numbers = Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => i + minNumber);

  // 处理数字选择
  const handleSelect = (num: number) => {
    onSelect(num);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* 浮层 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-4 pb-6 shadow-xl md:bottom-4 md:left-[2.5%] md:right-[2.5%] md:top-auto md:w-[95%] md:rounded-2xl md:pb-6"
          >
            {/* 标题栏 */}
            <div className="mb-6 relative">
              <h3 className="text-lg font-bold text-gray-800 md:text-xl text-center">{title}</h3>
              {/* 关闭按钮 - 右上角 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute -top-1 -right-1 p-2 rounded-full hover:bg-gray-100"
              >
                <Icon icon="mdi:close" className="w-6 h-6 text-gray-500" />
              </motion.button>
            </div>

            {/* 数字网格 */}
            <div className="grid grid-cols-11 md:grid-cols-16 gap-2 md:gap-3">
              {numbers.map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(num)}
                  className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-b from-violet-400 to-purple-500 text-lg font-bold text-white shadow-md md:h-14 md:text-xl"
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
