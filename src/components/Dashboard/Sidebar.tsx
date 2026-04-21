import { LayoutGrid, CalendarDays, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { useMascot } from '../../hooks/useMascot';
import { getMascotAsset } from '../Mascot/mascotAssets';

export const Sidebar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isTracker = location.pathname === '/tracker';
  const { isDark, setTheme } = useTheme();
  const mascot = useMascot();

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const btnClass = "w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group";
  const inactiveClass = "text-gray-400 hover:text-indigo-500 hover:bg-white/60 dark:hover:bg-white/10";
  const activeClass = "bg-indigo-500 text-white shadow-[0_10px_20px_-10px_rgba(99,102,241,0.8)]";

  return (
    <div className="w-20 md:w-24 h-full flex flex-col items-center py-6 lg:py-8 justify-between shrink-0 z-50">
      
      {/* Brand Logo */}
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-[0_10px_20px_-10px_rgba(99,102,241,0.8)] cursor-pointer hover:scale-105 transition-transform">
        H
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col gap-4 items-center flex-1 w-full mt-10">
        <Link to="/">
          <button className={`${btnClass} ${isDashboard ? activeClass : inactiveClass}`}>
            <LayoutGrid size={22} strokeWidth={isDashboard ? 2.5 : 2} />
          </button>
        </Link>
        <Link to="/tracker">
          <button className={`${btnClass} ${isTracker ? activeClass : inactiveClass}`}>
            <CalendarDays size={22} strokeWidth={isTracker ? 2.5 : 2} />
          </button>
        </Link>
      </div>

      {/* Toggles & Avatar */}
      <div className="flex flex-col gap-3 items-center w-full mt-auto">
        
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className={`${btnClass} ${inactiveClass}`}>
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Divider */}
        <div className="w-6 h-[2px] bg-gray-200 dark:bg-gray-800 rounded-full my-2"></div>

        {/* Avatar */}
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full border-[2px] border-transparent hover:border-indigo-400 shadow-sm overflow-visible cursor-pointer transition-all relative group">
          <img src={getMascotAsset(mascot.state, isDark)} alt="avatar" className="w-full h-full object-cover rounded-full" />
          {/* Tooltip for Hi Master */}
          <div className="absolute left-[120%] top-1/2 -translate-y-1/2 bg-black/80 dark:bg-white/90 text-white dark:text-black font-semibold text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Hi, Master
          </div>
        </div>

      </div>
    </div>
  );
};
