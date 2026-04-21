import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  text: string;
  isDark: boolean;
}

export const SpeechBubble = ({ text, isDark }: Props) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, scale: 0.8, y: 30, rotate: isDark ? -5 : 5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20, rotate: isDark ? 5 : -5 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className={`absolute top-20 md:top-32 ${isDark ? '-right-32 md:-right-48 lg:-right-56' : '-left-32 md:-left-48 lg:-left-56'} w-[180px] md:w-[240px] z-50`}
      >
        <div className="glass-card p-4 md:p-5 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] relative border-2 border-white/80 dark:border-white/20 bg-white/60 dark:bg-black/60 rounded-[24px]">
          <p className="leading-snug text-center">{text}</p>
          <div className={`absolute top-1/2 -translate-y-1/2 ${isDark ? '-left-[11px] border-b-2 border-l-2' : '-right-[11px] border-t-2 border-r-2'} w-5 h-5 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-white/80 dark:border-white/20 transform rotate-45 shadow-[0px_0px_20px_-5px_rgba(0,0,0,0.1)]`}></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
