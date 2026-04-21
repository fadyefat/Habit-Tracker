import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { NotificationProvider } from './components/UI/NotificationProvider';
import { MascotLayer } from './components/Mascot/MascotLayer';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Sidebar } from './components/Dashboard/Sidebar';
import { useState } from 'react';
import { Plus } from 'lucide-react';

// Using mock versions initially, we will inject full modal elements next.
import { AddHabitModal } from './components/Habits/AddHabitModal';
import { HabitDetailModal } from './components/Habits/HabitDetailModal';
import { HabitSheet } from './components/Habits/HabitSheet';

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="min-h-screen relative overflow-hidden font-sans flex text-gray-800 dark:text-gray-100 transition-colors duration-500">
            <MascotLayer />
            
            <Sidebar />
            
            <Routes>
              <Route path="/" element={<Dashboard onSelectHabit={setSelectedHabitId} />} />
              <Route path="/tracker" element={<HabitSheet onSelectHabit={setSelectedHabitId} />} />
            </Routes>

            {/* Global Add Habit FAB */}
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] w-14 h-14 md:w-16 md:h-16 bg-indigo-500 hover:bg-indigo-400 text-white rounded-[20px] md:rounded-[24px] flex items-center justify-center hover:scale-105 transition-all border-4 border-indigo-200 dark:border-indigo-900 group"
              title="Add New Habit"
            >
               <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {isAddModalOpen && <AddHabitModal onClose={() => setIsAddModalOpen(false)} />}
            {selectedHabitId && <HabitDetailModal habitId={selectedHabitId} onClose={() => setSelectedHabitId(null)} />}
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App;
