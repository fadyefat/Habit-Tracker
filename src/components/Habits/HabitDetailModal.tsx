import { useState } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Target, Activity, Trash2, Save } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 mb-2 mt-1">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0z"/>
  </svg>
)

export const HabitDetailModal = ({ habitId, onClose }: { habitId: string, onClose: () => void }) => {
  const { habits, logs, updateHabit, removeHabit } = useHabits();
  const habit = habits.find(h => h.id === habitId);

  const [mode, setMode] = useState<'overview' | 'edit'>('overview');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [editTitle, setEditTitle] = useState(habit?.title || '');
  const [editFreq, setEditFreq] = useState(habit?.targetDaysPerWeek || 7);
  const [editWorkPeriod, setEditWorkPeriod] = useState(habit?.workPeriod || 0);
  const [editRestPeriod, setEditRestPeriod] = useState(habit?.restPeriod || 0);

  if (!habit) return null;

  const handleDelete = () => {
    if (window.confirm('Are you absolutely sure you want to completely delete this habit and all of its historical logs?')) {
      removeHabit(habit.id);
      onClose();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateHabit(habit.id, { 
      title: editTitle, 
      targetDaysPerWeek: editFreq,
      workPeriod: editWorkPeriod,
      restPeriod: editRestPeriod
    });
    setMode('overview');
  };

  const generateChartData = () => {
    const data = [];
    if (timeframe === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const isComplete = logs.some(l => l.habitId === habitId && l.date === dateStr && l.completed);
        data.push({ name: d.toLocaleDateString('en-US', { weekday: 'short' }), completed: isComplete ? 1 : 0 });
      }
    } else if (timeframe === 'monthly') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const isComplete = logs.some(l => l.habitId === habitId && l.date === dateStr && l.completed);
        const label = i % 4 === 0 ? d.getDate().toString() : '';
        data.push({ name: label, completed: isComplete ? 1 : 0 });
      }
    } else if (timeframe === 'yearly') {
       for (let i = 11; i >= 0; i--) {
         const d = new Date(); d.setMonth(d.getMonth() - i);
         const monthMatch = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
         const thisMonthLogs = logs.filter(l => l.habitId === habitId && l.date.startsWith(monthMatch) && l.completed);
         data.push({ name: d.toLocaleDateString('en-US', { month: 'short' }), completed: thisMonthLogs.length });
       }
    }
    return data;
  };
  const chartData = generateChartData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mx-4 min-h-[500px]"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-8 pt-10 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition text-white">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => setMode('overview')} className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${mode === 'overview' ? 'bg-white text-indigo-900 border-white shadow-sm' : 'border-white/40 text-white/70 hover:bg-white/10'}`}>Overview</button>
            <button onClick={() => setMode('edit')} className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${mode === 'edit' ? 'bg-white text-indigo-900 border-white shadow-sm' : 'border-white/40 text-white/70 hover:bg-white/10'}`}>Settings</button>
          </div>
          
          <h2 className="text-4xl font-extrabold text-white leading-tight mt-4">{habit.title}</h2>
        </div>

        <div className="p-8 flex flex-col flex-1">
          <AnimatePresence mode="wait">
            {mode === 'overview' ? (
              <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-8 h-full">
                <div className="grid grid-cols-3 gap-4">
                     <div className="bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 p-5 rounded-[24px] flex flex-col items-center justify-center text-center shadow-sm">
                     <Flame size={28} className="text-orange-500 mb-2" />
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current</span>
                     <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{habit.currentStreak} <span className="text-sm">Day</span></span>
                  </div>
                  <div className="bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 p-5 rounded-[24px] flex flex-col items-center justify-center text-center shadow-sm">
                     <TrophyIcon />
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Longest</span>
                     <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{habit.longestStreak} <span className="text-sm">Day</span></span>
                  </div>
                     <div className="bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 p-5 rounded-[24px] flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                     <Target size={28} className="text-indigo-500 mb-2" />
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Frequency</span>
                     <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{habit.targetDaysPerWeek}<span className="text-xl text-gray-400">/</span><span className="text-sm">wk</span></span>
                  </div>
                </div>

                <div className="bg-white/40 dark:bg-black/20 p-6 pt-5 rounded-[30px] border border-white/60 dark:border-white/10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                      <Activity size={18} /> Adherence Visualizer
                    </h3>
                    <div className="flex bg-white/50 dark:bg-black/40 rounded-full p-1 border border-white/40 dark:border-white/10">
                       <button onClick={() => setTimeframe('weekly')} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${timeframe === 'weekly' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>1W</button>
                       <button onClick={() => setTimeframe('monthly')} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${timeframe === 'monthly' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>1M</button>
                       <button onClick={() => setTimeframe('yearly')} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${timeframe === 'yearly' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>1Y</button>
                    </div>
                  </div>
                  
                  <div className="w-full h-[180px] mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(0,0,0,0.8)', color: 'white' }} cursor={false} />
                        <Area type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorComp)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 'bold' }} dy={10} minTickGap={15} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full justify-between">
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Habit Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white/50 dark:bg-black/40 border border-white/60 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Weekly Target</label>
                    <div className="flex items-center gap-5 bg-white/50 dark:bg-black/40 border border-white/60 dark:border-white/10 rounded-2xl px-5 py-5">
                       <input 
                         type="range" min="1" max="7" 
                         value={editFreq} onChange={(e) => setEditFreq(parseInt(e.target.value))}
                         className="flex-1 accent-indigo-500"
                       />
                       <span className="font-bold text-gray-900 dark:text-white min-w-[70px] text-right text-lg">
                         {editFreq} {editFreq === 1 ? 'day' : 'days'}
                       </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 bg-white/50 dark:bg-black/40 border border-white/60 dark:border-white/10 rounded-2xl px-5 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white block">Flexible Schedule</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Set Work/Rest day pattern.</span>
                        </div>
                        <div className="text-indigo-500 font-black text-sm">{editWorkPeriod || 0}W / {editRestPeriod || 0}R</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Work Days</label>
                        <input 
                            type="number" min="0" max="30" 
                            value={editWorkPeriod} onChange={(e) => setEditWorkPeriod(parseInt(e.target.value) || 0)}
                            className="w-full bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Rest Days</label>
                        <input 
                            type="number" min="0" max="30" 
                            value={editRestPeriod} onChange={(e) => setEditRestPeriod(parseInt(e.target.value) || 0)}
                            className="w-full bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="mt-2 w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02]"
                  >
                    <Save size={20} /> Save Changes
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-4 font-semibold">Danger Zone</p>
                  <button 
                    onClick={handleDelete}
                    className="w-full py-4 rounded-2xl bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold text-lg flex items-center justify-center gap-2 transition-all border border-red-200 dark:border-red-900/50"
                  >
                    <Trash2 size={20} /> Delete Habit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
