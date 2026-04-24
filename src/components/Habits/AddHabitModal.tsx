import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';

export const AddHabitModal = ({ onClose }: { onClose: () => void }) => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState('');
  const [category] = useState('general');
  const [frequency, setFrequency] = useState(7);
  const [workPeriod, setWorkPeriod] = useState(0);
  const [restPeriod, setRestPeriod] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHabit(title, category, frequency, workPeriod, restPeriod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/60 dark:border-white/10 p-10 rounded-[40px] shadow-2xl mx-4"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition">
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Create Habit</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Habit Name</label>
            <input 
              autoFocus
              type="text" 
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 20 pages"
              className="w-full bg-white/50 dark:bg-black/40 border border-white/60 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Weekly Target</label>
            <div className="flex items-center gap-5 bg-white/50 dark:bg-black/40 border border-white/60 dark:border-white/10 rounded-2xl px-5 py-5">
               <input 
                 type="range" min="1" max="7" 
                 value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))}
                 className="flex-1 accent-indigo-500"
               />
               <span className="font-bold text-gray-900 dark:text-white min-w-[70px] text-right text-lg">
                 {frequency} {frequency === 1 ? 'day' : 'days'}
               </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-2 ml-1">Days per week target.</p>
          </div>

          <div className="flex flex-col gap-4 bg-white/50 dark:bg-black/40 border border-white/60 dark:border-white/10 rounded-2xl px-5 py-5">
             <div className="flex items-center justify-between">
                <div>
                   <span className="text-sm font-bold text-gray-900 dark:text-white block">Flexible Schedule</span>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Set Work/Rest day pattern.</span>
                </div>
                <div className="text-indigo-500 font-black text-sm">{workPeriod || 0}W / {restPeriod || 0}R</div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Work Days</label>
                  <input 
                      type="number" min="0" max="30" 
                      value={workPeriod} onChange={(e) => setWorkPeriod(parseInt(e.target.value) || 0)}
                      className="w-full bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Rest Days</label>
                  <input 
                      type="number" min="0" max="30" 
                      value={restPeriod} onChange={(e) => setRestPeriod(parseInt(e.target.value) || 0)}
                      className="w-full bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                </div>
             </div>

             <p className="text-[10px] text-gray-400 font-semibold italic">
                {workPeriod === 0 || restPeriod === 0 
                  ? "Standard schedule. Habit appears every day." 
                  : `Cycle: Work ${workPeriod} days, then Rest ${restPeriod} days.`}
             </p>
          </div>

          <button 
            type="submit"
            className="mt-6 w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02]"
          >
            <Plus size={24} /> Create New Habit
          </button>
        </form>
      </motion.div>
    </div>
  );
};
