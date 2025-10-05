import { useEffect, useRef, useState } from "react";
import { Sparkles, Zap, Brain, Lightbulb, MessageSquare, TrendingUp, Code, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Sidebar from "@/components/Sidebar";
import SettingsModal from "@/components/SettingsModal";
import { useChat } from "@/hooks/useChat";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMobileGestures } from "@/hooks/useMobileGestures";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);

  // Handle mobile sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarExpanded(true);
      } else {
        setSidebarExpanded(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const suggestedPrompts = [
    {
      icon: <Brain className="w-4 h-4" />,
      title: "Explain quantum computing",
      subtitle: "In simple terms with examples",
      prompt: "Explain quantum computing in simple terms with practical examples"
    },
    {
      icon: <Code className="w-4 h-4" />,
      title: "Write a React component",
      subtitle: "With TypeScript and hooks",
      prompt: "Help me write a React component with TypeScript that manages a todo list"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Market analysis",
      subtitle: "Latest trends and insights",
      prompt: "Provide an analysis of current market trends in AI and technology"
    },
    {
      icon: <Globe className="w-4 h-4" />,
      title: "World news summary",
      subtitle: "Today's important events",
      prompt: "Give me a summary of today's most important world news and events"
    }
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
    setShowWelcome(false);
  };

  const handleNewChat = () => {
    clearMessages();
    setShowWelcome(true);
  };

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewChat: handleNewChat,
    onToggleSidebar: handleToggleSidebar,
    onFocusInput: handleFocusInput,
    onClearChat: () => {
      clearMessages();
      setShowWelcome(true);
    },
    onOpenSettings: () => setShowSettings(true),
    onEscape: () => {
      setShowSettings(false);
    },
  });

  // Mobile gestures
  useMobileGestures({
    onSwipeRight: () => {
      if (window.innerWidth < 1024 && !sidebarExpanded) {
        setSidebarExpanded(true);
      }
    },
    onSwipeLeft: () => {
      if (window.innerWidth < 1024 && sidebarExpanded) {
        setSidebarExpanded(false);
      }
    },
    onSwipeUp: () => {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onSwipeDown: () => {
      // Focus input
      handleFocusInput();
    },
    onLongPress: () => {
      // Open settings on long press
      setShowSettings(true);
    },
    onTap: () => {
      // Close sidebar on tap outside (handled by overlay)
    }
  });

  return (
    <div className="flex h-screen bg-black text-white relative">
      {/* Mobile Overlay */}
      {sidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          onNewChat={handleNewChat}
          expanded={sidebarExpanded}
          onToggleExpanded={handleToggleSidebar}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4 bg-black/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={handleToggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">AJ STUDIOZ</h1>
                <p className="text-xs text-gray-400">AI Assistant</p>
              </div>
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {showWelcome && messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-full px-4 py-8 sm:py-12"
              >
                <div className="max-w-4xl mx-auto text-center">
                  {/* Hero Section */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-6 sm:mb-8"
                  >
                    <div className="relative mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center mb-4 sm:mb-6 shadow-2xl">
                        <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 blur-xl" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                      Hey, I'm AJ STUDIOZ
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 mb-2 max-w-2xl mx-auto leading-relaxed px-4">
                      Your advanced AI assistant powered by cutting-edge technology.
                    </p>
                    <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto px-4">
                      I can help you with coding, analysis, creative writing, research, and much more.
                    </p>
                  </motion.div>

                  {/* Suggested Prompts */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto mb-6 sm:mb-8 px-4"
                  >
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full h-auto p-4 sm:p-6 text-left bg-gray-900/50 hover:bg-gray-800/70 border border-gray-800 hover:border-gray-700 rounded-xl transition-all duration-300 group touch-manipulation"
                          onClick={() => handleSuggestedPrompt(prompt.prompt)}
                        >
                          <div className="flex items-start gap-3 sm:gap-4 w-full">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors flex-shrink-0">
                              {prompt.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                                {prompt.title}
                              </h3>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                {prompt.subtitle}
                              </p>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 px-4"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span>Real-time responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-green-400" />
                      <span>Code generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span>Creative solutions</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-gray-800"
              >
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full py-6 sm:py-8 px-4"
                  >
                    <div className="max-w-4xl mx-auto">
                      <div className="flex gap-4 sm:gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white animate-pulse" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex gap-1.5">
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
                          <p className="text-gray-400 text-sm mt-2">AJ STUDIOZ is thinking...</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <ChatInput 
          ref={inputRef}
          onSendMessage={sendMessage} 
          disabled={isLoading} 
        />
      </main>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default Index;
