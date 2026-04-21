import { motion, AnimatePresence } from 'framer-motion';
import { useMascot } from '../../hooks/useMascot';
import { getMascotAsset } from './mascotAssets';
import { SpeechBubble } from './SpeechBubble';
import { useTheme } from '../../context/ThemeProvider';
import { useState, useEffect, useRef } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { getTodayString } from '../../utils/dateHelpers';
import { useLocation } from 'react-router-dom';

export const MascotLayer = () => {
  const { state, text: defaultText } = useMascot();
  const { isDark } = useTheme();
  const asset = getMascotAsset(state, isDark);
  const { habits, logs } = useHabits();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = (msg: string) => {
    setActiveMessage(msg);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMessage(null);
    }, 4500);
  };

  useEffect(() => {
    showMessage(defaultText);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [defaultText]);

  const handleMascotClick = () => {
    const today = getTodayString();
    const activeHabits = habits.filter(h => h.isActive);
    const completedTodayCount = logs.filter(
      l => l.date === today && l.completed && activeHabits.some(h => h.id === l.habitId)
    ).length;

    let contextualQuote = "";
    if (activeHabits.length === 0) {
      contextualQuote = "Time to add your first goal!";
    } else if (completedTodayCount === activeHabits.length) {
      contextualQuote = "Bravo! Masterful execution! Waiting for you tomorrow.";
    } else if (completedTodayCount >= activeHabits.length / 2) {
      contextualQuote = "Almost there! Let's finish strong!";
    } else {
      contextualQuote = "Keep going, you can absolutely do this!";
    }

    showMessage(contextualQuote);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Background Lighting Bloom */}
      <motion.div 
        animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-pink-300/20 to-indigo-400/20 blur-[100px] -z-10"
      />
      
      {/* Container framing area */}
      <div className="relative w-full h-full">
          {/* Mascot Wrapper supporting Alpha Transparency + Native PNG click events */}
          <AnimatePresence>
            <motion.div
              key={asset}
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                filter: "blur(0px)", 
                scale: isDashboard ? 1 : 0.35,
                y: '0vh'
              }}
              exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut", type: "tween" }}
              className={`absolute bottom-0 z-10 pointer-events-auto cursor-pointer ${isDark ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'}`}
              onClick={handleMascotClick}
            >
              <AnimatePresence>
                {isDashboard && activeMessage && <SpeechBubble text={activeMessage} isDark={isDark} />}
              </AnimatePresence>
              <img
                src={asset}
                alt={`Mascot - ${state}`}
                className={`h-[90vh] lg:h-[100vh] object-contain ${isDark ? 'object-left-bottom' : 'object-right-bottom'} drop-shadow-[0_0px_60px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_0px_50px_rgba(255,255,255,0.05)] bg-transparent`}
              />
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
};
