import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy load the ChatMessage component
const ChatMessage = lazy(() => import('./ChatMessage'));

interface LazyChatMessageProps {
  role: "user" | "assistant";
  content: string;
  messageId?: string;
  timestamp?: Date;
  isStreaming?: boolean;
  model?: string;
  tokens?: number;
  onCopy?: () => void;
  onRefresh?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  onShare?: (content: string) => void;
  onBookmark?: () => void;
  onEdit?: (newContent: string) => void;
  onDelete?: () => void;
  onRegenerate?: () => void;
  onContinue?: () => void;
}

// Loading skeleton component
const MessageSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full py-6 px-6"
  >
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gray-800 animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-800 rounded animate-pulse mb-2 w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-800 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function LazyChatMessage(props: LazyChatMessageProps) {
  return (
    <Suspense fallback={<MessageSkeleton />}>
      <ChatMessage {...props} />
    </Suspense>
  );
}
