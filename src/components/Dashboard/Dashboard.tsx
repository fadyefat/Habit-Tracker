import { useHabits } from '../../hooks/useHabits';
import { getTodayString, isRestDay, formatDateString } from '../../utils/dateHelpers';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../UI/NotificationProvider';
import { useMascot } from '../../hooks/useMascot';
import { getMascotAsset } from '../Mascot/mascotAssets';
import { useTheme } from '../../context/ThemeProvider';
import type { MouseEvent } from 'react';

export const Dashboard = ({ onSelectHabit }: { onSelectHabit: (id: string) => void }) => {
  const { habits, logs, toggleHabitComplete, removeHabit } = useHabits();
  const mascot = useMascot();
  const { notify } = useNotifications();
  const today = getTodayString();
  const { isDark } = useTheme();

  const activeHabits = habits.filter(h => {
    if (!h.isActive) return false;
    // Hide if it's a rest day
    const habitLogs = logs.filter(l => l.habitId === h.id && l.completed).sort((a, b) => a.date.localeCompare(b.date));
    const startDateStr = habitLogs.length > 0 ? habitLogs[0].date : formatDateString(new Date(h.createdAt));
    
    if (isRestDay(h.workPeriod || 0, h.restPeriod || 0, startDateStr, today)) {
       // If it's already completed today, show it.
       const isDone = logs.some(l => l.habitId === h.id && l.date === today && l.completed);
       return isDone; 
    }
    return true;
  });
  const completedTodayCount = logs.filter(
    l => l.date === today && l.completed && activeHabits.some(h => h.id === l.habitId)
  ).length;

  const handleToggle = (e: MouseEvent, id: string, habitTitle: string) => {
    e.stopPropagation();
    toggleHabitComplete(id, today);
    const wasCompleted = logs.some(l => l.habitId === id && l.date === today && l.completed);
    if (!wasCompleted) {
      notify(`Finished: ${habitTitle}`, "Great job ticking off your habit! Keep the streak going.", getMascotAsset(mascot.state, isDark));
    }
  };

  return (
    <div className={`flex-1 h-screen overflow-hidden p-6 xl:p-10 flex flex-col lg:flex-row items-center relative z-10 ${!isDark ? 'lg:flex-row-reverse' : ''}`}>
      
      {/* Brand - only visible on large screens */}
      <div className="absolute top-6 xl:top-8 left-6 xl:left-8 font-black text-xl xl:text-2xl tracking-[0.2em] text-gray-800/20 dark:text-white/20 uppercase hidden lg:block z-0">
         HA<br/>BIT
      </div>

      {/* Spacer for Mascot so it doesn't overlap ANYTHING */}
      <div className="hidden lg:block w-[15%] xl:w-[25%] 2xl:w-[30%] flex-shrink-0 pointer-events-none h-full" />

      {/* Main Content Area (Text + Stats + Checklist) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-16 items-center justify-center h-full w-full max-w-[1400px] mx-auto z-10">
        
        {/* Text & Stats Column */}
        <div className="flex-1 w-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left shrink-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8 lg:mb-10">
            <h1 className="text-[2rem] lg:text-[2.5rem] xl:text-[3.5rem] 2xl:text-[4rem] font-bold tracking-tight text-gray-900 dark:text-white leading-[1.15] shadow-none mb-4 lg:mb-6">
              Consistency <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">builds habits</span>,<br /> 
              not intensity.
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm xl:text-base max-w-xs xl:max-w-sm mx-auto lg:mx-0">
              Focus on daily progress. Small steps every day lead to massive results over time.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="flex gap-3 xl:gap-4 w-full justify-center lg:justify-start">
            <div className="bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[20px] xl:rounded-3xl p-4 xl:p-5 flex flex-col w-[110px] xl:w-[130px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-left hover:scale-105 transition-transform">
              <p className="text-gray-600 dark:text-gray-400 font-semibold mb-2 flex items-center gap-2 text-[10px] xl:text-xs">
                <span className="w-1.5 h-1.5 xl:w-2 xl:h-2 rounded-full bg-indigo-400" /> To do
              </p>
              <div className="mt-auto flex items-baseline">
                <span className="text-2xl xl:text-3xl font-bold leading-none">{activeHabits.length}</span>
                <span className="text-[9px] xl:text-[10px] text-gray-500 ml-1 uppercase tracking-widest">tasks</span>
              </div>
            </div>
            <div className="bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[20px] xl:rounded-3xl p-4 xl:p-5 flex flex-col w-[110px] xl:w-[130px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-left hover:scale-105 transition-transform">
              <p className="text-gray-600 dark:text-gray-400 font-semibold mb-2 flex items-center gap-2 text-[10px] xl:text-xs">
                <span className="w-1.5 h-1.5 xl:w-2 xl:h-2 rounded-full bg-emerald-400" /> Done
              </p>
              <div className="mt-auto flex items-baseline">
                <span className="text-2xl xl:text-3xl font-bold leading-none">{completedTodayCount}</span>
                <span className="text-[9px] xl:text-[10px] text-gray-500 ml-1 uppercase tracking-widest">tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Panel Column */}
        <div className="w-full max-w-[400px] lg:w-[320px] xl:w-[400px] h-[500px] lg:h-[85%] flex-shrink-0 flex flex-col z-30">
          <div className="w-full h-full flex flex-col pt-6 xl:pt-8 px-2 xl:px-4 pb-5 xl:pb-6 overflow-hidden relative">
            
            <h2 className="text-[20px] xl:text-[24px] font-medium flex items-center justify-center gap-2 xl:gap-3 mb-1 text-gray-900 dark:text-white tracking-tight z-10">
              Daily <span className="border-2 border-indigo-400 dark:border-white rounded-full px-3 xl:px-4 py-0 text-sm xl:text-base font-semibold leading-relaxed">Goals</span>
            </h2>
            <p className="text-[9px] xl:text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-6 xl:mb-8 z-10 uppercase tracking-widest text-center">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            {/* Clean Checklist */}
            <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide flex-1 px-1 custom-scrollbar z-10">
               {activeHabits.length === 0 && (
                 <p className="text-gray-500 font-medium text-xs xl:text-sm text-center mt-8">No habits added. Create one using the + button.</p>
               )}
               {activeHabits.map((h) => {
                 const isComp = logs.some(l => l.habitId === h.id && l.date === today && l.completed);
                 return (
                   <motion.div
                     layout
                     key={h.id}
                     onClick={() => onSelectHabit(h.id)}
                     className={`flex items-center justify-between group px-4 py-3 xl:px-5 xl:py-4 rounded-[16px] xl:rounded-[20px] cursor-pointer transition-all border ${
                       isComp 
                         ? 'bg-black/5 dark:bg-white/5 border-transparent opacity-60' 
                         : 'bg-white/40 dark:bg-black/20 backdrop-blur-md border-white/60 dark:border-white/10 shadow-sm hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-md'
                     }`}
                   >
                     <div className="flex items-center gap-3 xl:gap-4 flex-1 min-w-0">
                       <button 
                         onClick={(e) => handleToggle(e, h.id, h.title)}
                         className={`w-6 h-6 xl:w-7 xl:h-7 flex-shrink-0 rounded-md xl:rounded-lg flex items-center justify-center border-[2px] transition-all shadow-inner ${
                           isComp 
                             ? 'bg-emerald-500 border-emerald-500 text-white' 
                             : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                         }`}
                       >
                         {isComp && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={14} strokeWidth={4} /></motion.div>}
                       </button>
                       
                       <span className={`text-[13px] xl:text-[15px] font-semibold truncate transition-all duration-300 ${
                         isComp ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-100'
                       }`}>
                         {h.title}
                       </span>
                     </div>

                     {/* Badges and Actions */}
                     <div className="flex items-center gap-1 xl:gap-2 flex-shrink-0 ml-2">
                       {h.currentStreak > 1 && (
                         <span className="text-[9px] xl:text-[10px] font-extrabold px-1.5 xl:px-2 py-0.5 xl:py-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/60 dark:to-orange-800/40 text-orange-600 dark:text-orange-400 rounded-md border border-orange-200 dark:border-orange-900 shadow-sm">
                           🔥 {h.currentStreak}
                         </span>
                       )}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           removeHabit(h.id);
                         }}
                         className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                         title="Delete Habit"
                       >
                         <Trash2 size={14} />
                       </button>
                     </div>
                   </motion.div>
                 )
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
