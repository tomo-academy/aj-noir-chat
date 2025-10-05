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
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
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
        <div className="border-b border-gray-800/50 px-6 py-4 bg-gradient-to-r from-black/80 via-gray-900/60 to-black/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={handleToggleSidebar}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg relative">
                  <Sparkles className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">AJ STUDIOZ</h1>
                  <p className="text-sm text-gray-400">Advanced AI Assistant</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
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
                className="flex flex-col items-center justify-center h-full px-6 py-12"
              >
                <div className="max-w-5xl mx-auto text-center">
                  {/* Hero Section */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-8"
                  >
                    <div className="relative mb-8">
                      <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
                        <Zap className="w-12 h-12 text-white relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 blur-xl" />
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                      Hey, I'm AJ STUDIOZ
                    </h1>
                    <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                      Your advanced AI assistant powered by cutting-edge technology and designed for the future.
                    </p>
                    <p className="text-base text-gray-400 max-w-2xl mx-auto">
                      I can help you with coding, analysis, creative writing, research, problem-solving, and much more. Let's create something amazing together!
                    </p>
                  </motion.div>

                  {/* Suggested Prompts */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-8"
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
                          className="w-full h-auto p-6 text-left bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700/50 hover:border-gray-600/50 rounded-2xl transition-all duration-300 group backdrop-blur-sm"
                          onClick={() => handleSuggestedPrompt(prompt.prompt)}
                        >
                          <div className="flex items-start gap-4 w-full">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors flex-shrink-0">
                              {prompt.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors text-base">
                                {prompt.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
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
                    className="flex flex-wrap justify-center gap-6 text-sm text-gray-400"
                  >
                    <div className="flex items-center gap-2 bg-gray-900/40 px-4 py-2 rounded-full border border-gray-700/50">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span>Real-time responses</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-900/40 px-4 py-2 rounded-full border border-gray-700/50">
                      <Code className="w-4 h-4 text-green-400" />
                      <span>Code generation</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-900/40 px-4 py-2 rounded-full border border-gray-700/50">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span>Creative solutions</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-900/40 px-4 py-2 rounded-full border border-gray-700/50">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span>Advanced analytics</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-gray-800/30"
              >
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    timestamp={new Date()}
                    model="GPT-4"
                    tokens={Math.floor(Math.random() * 2000) + 500}
                  />
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full py-8 px-6"
                  >
                    <div className="max-w-5xl mx-auto">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden">
                            <Sparkles className="w-6 h-6 text-white relative z-10 animate-pulse" />
                            <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-blue-400">AJ STUDIOZ</span>
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                              AI Assistant
                            </Badge>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
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
          isGenerating={isLoading}
          messageCount={messages.length}
          onClearHistory={handleNewChat}
          onExportChat={() => {
            const chatData = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
            const blob = new Blob([chatData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aj-studioz-chat-${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          onCopyChat={() => {
            const chatData = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
            navigator.clipboard.writeText(chatData);
          }}
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
