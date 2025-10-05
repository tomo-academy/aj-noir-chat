import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopGeneration?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
}

const ChatInput = ({ 
  onSendMessage, 
  onStopGeneration,
  disabled = false, 
  isGenerating = false,
  placeholder = "Ask anything"
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating && onStopGeneration) {
        onStopGeneration();
      } else {
        handleSend();
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        {/* Main input container */}
        <div className="relative flex items-end gap-2 sm:gap-3">
          <div className="relative flex-1 bg-gray-100 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? "Generating response..." : placeholder}
              disabled={disabled || isGenerating}
              className="min-h-[48px] sm:min-h-[52px] max-h-[160px] resize-none bg-transparent border-0 px-4 sm:px-5 py-3 sm:py-3.5 pr-16 sm:pr-20 text-sm sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 text-gray-900 dark:text-gray-100"
              rows={1}
            />
            
            {/* Right side controls */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {/* Attach button */}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                disabled={disabled || isGenerating}
              >
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Voice/Send button */}
          <Button
            size="icon"
            variant="ghost"
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex-shrink-0 transition-all ${
              input.trim() 
                ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' 
                : isRecording
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
            }`}
            onClick={input.trim() ? handleSend : toggleRecording}
            disabled={disabled && !isRecording}
          >
            {input.trim() ? (
              <Send className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            ) : (
              <Mic className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            )}
          </Button>
        </div>
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-red-500 dark:text-red-400">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="font-medium">Recording...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
