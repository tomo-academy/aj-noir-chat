import { useState, useEffect, useCallback } from 'react';

interface RealtimeFeatures {
  isOnline: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  lastSeen: Date | null;
  typingUsers: string[];
  messageReactions: Record<string, string[]>;
  addReaction: (messageId: string, reaction: string) => void;
  removeReaction: (messageId: string, reaction: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export const useRealtimeFeatures = (): RealtimeFeatures => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [messageReactions, setMessageReactions] = useState<Record<string, string[]>>({});

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% uptime simulation
      setLastSeen(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addReaction = useCallback((messageId: string, reaction: string) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), reaction]
    }));
  }, []);

  const removeReaction = useCallback((messageId: string, reaction: string) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: (prev[messageId] || []).filter(r => r !== reaction)
    }));
  }, []);

  const startTyping = useCallback(() => {
    setTypingUsers(prev => [...new Set([...prev, 'user'])]);
  }, []);

  const stopTyping = useCallback(() => {
    setTypingUsers(prev => prev.filter(user => user !== 'user'));
  }, []);

  return {
    isOnline,
    connectionStatus,
    lastSeen,
    typingUsers,
    messageReactions,
    addReaction,
    removeReaction,
    startTyping,
    stopTyping
  };
};
