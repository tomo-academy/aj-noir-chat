import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-background dark">
      {/* Sidebar */}
      <Sidebar onNewChat={clearMessages} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-semibold mb-3">
                Hello
              </h1>
              <p className="text-muted-foreground text-center max-w-md text-[15px]">
                I am AJ STUDIOZ, your advanced AI assistant. How can I help you today?
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isLoading && (
                <div className="w-full py-8 px-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
      </main>
    </div>
  );
};

export default Index;
