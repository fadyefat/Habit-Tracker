import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  avatarUrl?: string;
}

interface NotificationContextType {
  notify: (title: string, message: string, avatarUrl?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = (title: string, message: string, avatarUrl?: string) => {
    const newToast = { id: crypto.randomUUID(), title, message, avatarUrl };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="glass-card pointer-events-auto w-80 p-4 border border-white/40 flex items-start space-x-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              {toast.avatarUrl && (
                <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-white/60 shadow-inner">
                  <img src={toast.avatarUrl} alt="Mascot" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{toast.title}</h4>
                <p className="text-gray-700 dark:text-gray-200 text-xs mt-1 font-medium">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
