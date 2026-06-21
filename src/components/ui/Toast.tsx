import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle, Info } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <Check className="w-4 h-4" />,
  error: <AlertCircle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
};

const ACCENTS: Record<ToastVariant, string> = {
  success: 'text-emerald-600',
  error: 'text-rose-600',
  info: 'text-wedding-accent',
};

interface Props {
  toasts: ToastItem[];
}

const ToastContainer: React.FC<Props> = ({ toasts }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map(t => (
        <motion.div
          key={t.id}
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="pointer-events-auto flex items-center gap-2.5 bg-white/95 backdrop-blur-sm shadow-lg shadow-black/10 border border-gray-100 rounded-full px-5 py-3 text-sm text-wedding-primary max-w-[90vw]"
        >
          <span className={ACCENTS[t.variant]}>{ICONS[t.variant]}</span>
          <span className="truncate">{t.message}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default ToastContainer;
