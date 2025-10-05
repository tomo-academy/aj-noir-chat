import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface TypingIndicatorProps {
  users: string[];
  isVisible: boolean;
}

export default function TypingIndicator({ users, isVisible }: TypingIndicatorProps) {
  if (!isVisible || users.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-full py-4 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-gray-700/50 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-gray-300">
                {users.length === 1 ? users[0] : `${users.length} people`} {users.length === 1 ? 'is' : 'are'} typing
              </span>
            </div>
            <div className="flex gap-2">
              <motion.span 
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0 }}
              />
              <motion.span 
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              />
              <motion.span 
                className="w-2 h-2 bg-pink-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
