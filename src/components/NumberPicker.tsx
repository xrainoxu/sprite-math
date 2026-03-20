import { motion, AnimatePresence } from 'framer-motion';

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
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-4 pb-6 shadow-xl md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:max-w-md md:pb-6"
          >
            {/* 标题 */}
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold text-gray-800 md:text-xl">{title}</h3>
            </div>

            {/* 数字网格 */}
            <div className="grid grid-cols-6 gap-2 md:gap-3">
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

            {/* 关闭按钮 */}
            <div className="mt-4 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="rounded-full bg-gray-200 px-8 py-2 text-base font-medium text-gray-600 md:px-12 md:py-3 md:text-lg"
              >
                取消
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
