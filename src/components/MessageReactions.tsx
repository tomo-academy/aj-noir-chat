import { useState } from 'react';
import { Heart, ThumbsUp, ThumbsDown, Laugh, Angry, Sad, Surprised } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageReactionsProps {
  messageId: string;
  reactions: string[];
  onAddReaction: (messageId: string, reaction: string) => void;
  onRemoveReaction: (messageId: string, reaction: string) => void;
}

const reactionEmojis = {
  'like': '👍',
  'love': '❤️',
  'laugh': '😂',
  'angry': '😠',
  'sad': '😢',
  'surprised': '😮'
};

const reactionIcons = {
  'like': ThumbsUp,
  'love': Heart,
  'laugh': Laugh,
  'angry': Angry,
  'sad': Sad,
  'surprised': Surprised
};

export default function MessageReactions({ 
  messageId, 
  reactions, 
  onAddReaction, 
  onRemoveReaction 
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction] = (acc[reaction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleReactionClick = (reaction: string) => {
    if (reactions.includes(reaction)) {
      onRemoveReaction(messageId, reaction);
    } else {
      onAddReaction(messageId, reaction);
    }
    setShowPicker(false);
  };

  return (
    <div className="flex items-center gap-1 mt-2">
      {/* Existing reactions */}
      <AnimatePresence>
        {Object.entries(reactionCounts).map(([reaction, count]) => (
          <motion.div
            key={reaction}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs bg-gray-800/50 hover:bg-gray-700/50 rounded-full"
                    onClick={() => handleReactionClick(reaction)}
                  >
                    <span className="mr-1">{reactionEmojis[reaction as keyof typeof reactionEmojis]}</span>
                    <span>{count}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                  {reaction} ({count})
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add reaction button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 bg-gray-800/50 hover:bg-gray-700/50 rounded-full"
              onClick={() => setShowPicker(!showPicker)}
            >
              <span className="text-xs">+</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-800 border-gray-700">
            Add reaction
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Reaction picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-2 shadow-2xl z-50"
          >
            <div className="flex gap-1">
              {Object.entries(reactionEmojis).map(([reaction, emoji]) => (
                <TooltipProvider key={reaction}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-700/50 rounded-lg"
                        onClick={() => handleReactionClick(reaction)}
                      >
                        <span className="text-sm">{emoji}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                      {reaction}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
