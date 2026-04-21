import { useState } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { formatDateString } from '../../utils/dateHelpers';
import { motion } from 'framer-motion';
import { Check, Trash2, GripVertical } from 'lucide-react';
import type { MouseEvent, DragEvent } from 'react';

export const HabitSheet = ({ onSelectHabit }: { onSelectHabit: (id: string) => void }) => {
  const { habits, logs, toggleHabitComplete, removeHabit, reorderHabit } = useHabits();
  
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Generate past 14 days
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const activeHabits = habits.filter(h => h.isActive);

  const handleToggle = (e: MouseEvent, id: string, dateStr: string) => {
    e.stopPropagation();
    toggleHabitComplete(id, dateStr);
  };

  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragEnd = () => {
    if (draggedId && dragOverId && draggedId !== dragOverId) {
      reorderHabit(draggedId, dragOverId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="flex-1 p-4 md:p-10 z-20 flex flex-col h-screen overflow-y-auto w-full max-w-[1400px] mx-auto pt-24 md:pt-10 relative">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[3rem] font-medium tracking-tight text-gray-900 dark:text-white mb-10 z-20"
      >
        Habit <span className="inline-block bg-white/50 dark:bg-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/20 rounded-full px-6 py-1 shadow-xl">Tracker</span>
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#0c1222]/80 backdrop-blur-3xl border border-white/70 dark:border-white/5 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] p-8 overflow-x-auto relative z-20"
      >
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-4 border-b-2 border-gray-200 dark:border-gray-800/50 font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-white/80 dark:bg-[#0c1222]/95 backdrop-blur-xl z-30 min-w-[200px] shadow-[10px_0_15px_-3px_rgba(0,0,0,0.05)]">Habit</th>
              {days.map((d, idx) => (
                <th key={idx} className={`p-4 border-b-2 border-gray-200 dark:border-gray-800/50 font-bold text-center w-24 ${idx === days.length - 1 ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
                  <div className={`text-[10px] uppercase tracking-widest font-bold ${idx === days.length - 1 ? 'text-indigo-500' : 'text-gray-500'}`}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-xl mt-1 ${idx === days.length - 1 ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-gray-900 dark:text-white'}`}>
                    {d.getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeHabits.map((habit) => (
              <tr 
                key={habit.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, habit.id)}
                onDragEnter={(e) => handleDragEnter(e, habit.id)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
                className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors group ${draggedId === habit.id ? 'opacity-30' : ''} ${dragOverId === habit.id ? 'border-t-2 border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/20' : ''}`}
              >
                <td className="p-4 border-b border-gray-200 dark:border-gray-800/50 font-semibold text-[17px] sticky left-0 bg-white/80 dark:bg-[#0c1222]/95 backdrop-blur-xl group-hover:bg-white/90 dark:group-hover:bg-[#1a2333]/95 transition-colors z-20 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.05)] text-gray-800 dark:text-gray-100 cursor-pointer" onClick={() => onSelectHabit(habit.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity">
                        <GripVertical size={16} />
                      </div>
                      <span>{habit.title}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeHabit(habit.id); }} 
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete Habit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                {days.map((d, idx) => {
                  const dateStr = formatDateString(d);
                  const isComp = logs.some(l => l.habitId === habit.id && l.date === dateStr && l.completed);
                  return (
                    <td key={idx} className={`p-4 border-b border-gray-200 dark:border-gray-800/50 text-center ${idx === days.length - 1 ? 'bg-indigo-50/20 dark:bg-indigo-900/10' : ''}`}>
                      <button 
                        onClick={(e) => handleToggle(e, habit.id, dateStr)}
                        className={`w-10 h-10 mx-auto rounded-[12px] flex items-center justify-center border-[2px] transition-all shadow-inner ${
                          isComp 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                            : 'bg-white/80 dark:bg-black/50 border-gray-300 dark:border-gray-600/50 hover:border-indigo-400'
                        }`}
                      >
                        {isComp && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={20} strokeWidth={4} /></motion.div>}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            {activeHabits.length === 0 && (
              <tr>
                <td colSpan={days.length + 1} className="p-10 text-center text-gray-500 font-medium">
                  No habits to track yet. Add a new goal to see it here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};
